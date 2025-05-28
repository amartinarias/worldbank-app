// CountrySearch.spec.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import CountrySearch from '../CountrySearch.vue';
import axios from 'axios';

vi.mock('axios', () => ({
    default: {
        get: vi.fn(() => Promise.resolve({ data: {} })),
    },
}));

// --- Mocked Reactive Refs ---
const mockCountryData = ref(null);
const mockApiError = ref(null);
const mockIsLoading = ref(false);
const mockFetchCountry = vi.fn();
const mockValidateForm = vi.fn();
const mockUpdateField = vi.fn();
const mockFormData = ref({ isoCode: '' });
const mockFormErrors = ref({});

// --- Mock Composables used by CountrySearch ---
vi.mock('../../composables/useWorldBank', () => ({ // <<< TARGETING useWorldBank.js
    useWorldBankApi: () => ({                        // <<< MOCKING the useWorldBankApi export
        countryData: mockCountryData,
        error: mockApiError,
        isLoading: mockIsLoading,
        fetchCountry: mockFetchCountry,
    }),
}));

vi.mock('../../composables/useSimpleForm', () => ({
    useSimpleForm: () => ({
        formData: mockFormData,
        formErrors: mockFormErrors,
        validateForm: mockValidateForm,
        updateField: mockUpdateField,
    }),
}));

vi.mock('../../schemas/validationSchemas', () => ({
    worldBankSchema: {},
}));


describe('CountrySearch.vue', () => {
    let wrapper;

    beforeEach(() => {
        // Reset Vitest mocks 
        vi.clearAllMocks();

        // Clear the global axios mock if it was used 
        if (axios.get && typeof axios.get.mockClear === 'function') {
            axios.get.mockClear();
        }

        mockCountryData.value = null;
        mockApiError.value = null;
        mockIsLoading.value = false;
        mockFormData.value = { isoCode: '' };
        mockFormErrors.value = {};

        // Set default mock implementations that return promises for async functions
        mockValidateForm.mockResolvedValue(true); // Default to form validation succeeding
        mockFetchCountry.mockResolvedValue({ data: { name: 'Default Mocked Country' } }); // Default to fetch succeeding

        // Mount a fresh instance of the component for each test
        wrapper = mount(CountrySearch);
    });

    // TEST 1: 
    it('renders the main container, title, input, button, and initial message', () => {
        expect(wrapper.find('.country-search-container').exists()).toBe(true);
        expect(wrapper.find('h1.app-title').text()).toBe('Country Data Finder');
        expect(wrapper.find('input#isoInput').exists()).toBe(true);
        expect(wrapper.find('button.search-button').text()).toContain('Search');
        expect(wrapper.find('.initial-message').exists()).toBe(true);
    });

    // TEST 2
    it('calls updateField from useSimpleForm when isoCode input changes', async () => {
        const inputElement = wrapper.find('input#isoInput');
        await inputElement.setValue('US');
        expect(mockUpdateField).toHaveBeenCalledWith('isoCode', 'US');
    });

    // TEST 3: 
    it('calls validateForm and then fetchCountry on search button click if form is valid', async () => {
        mockValidateForm.mockResolvedValue(true);
        mockFormData.value.isoCode = 'VALIDCODE';

        await wrapper.find('button.search-button').trigger('click');
        // Wait for async operations in handleSearch and subsequent DOM updates
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        expect(mockValidateForm).toHaveBeenCalled();
        expect(mockFetchCountry).toHaveBeenCalledWith('VALIDCODE');
    });

    // TEST 4
    it('calls validateForm, does not call fetchCountry, and shows validation error if form is invalid', async () => {
        mockValidateForm.mockResolvedValue(false);
        mockFormErrors.value = { isoCode: 'Test validation error' };

        await wrapper.find('button.search-button').trigger('click');
        await wrapper.vm.$nextTick();

        expect(mockValidateForm).toHaveBeenCalled();
        expect(mockFetchCountry).not.toHaveBeenCalled();
        expect(wrapper.find('.validation-error').text()).toBe('Test validation error');
        expect(wrapper.find('.validation-failure-display').exists()).toBe(true);
        expect(wrapper.find('.sub-text-message').text()).toBe('Test validation error');
    });

    // TEST 5
    it('displays loading state correctly when isLoading is true', async () => {
        mockIsLoading.value = true;
        await wrapper.vm.$nextTick();

        expect(wrapper.find('.loading-display').exists()).toBe(true);
        expect(wrapper.find('button.search-button').text()).toBe('Searching...');
        expect(wrapper.find('button.search-button').attributes('disabled')).toBeDefined();
        expect(wrapper.find('.country-info').exists()).toBe(false);
        expect(wrapper.find('.error-message').exists()).toBe(false);
    });

    // TEST 6:
    it('displays country data correctly when fetch is successful and not loading', async () => {
        mockCountryData.value = {
            name: 'Testland', iso2Code: 'TL', capitalCity: 'Testville',
            region: { value: 'Test Region' }, incomeLevel: { value: 'High' },
            latitude: '10.00', longitude: '-20.00',
        };
        mockIsLoading.value = false;
        mockApiError.value = null;
        mockFormErrors.value = {};
        await wrapper.vm.$nextTick();

        expect(wrapper.find('.country-info').exists()).toBe(true);
        expect(wrapper.find('.country-info h2').text()).toBe('Testland (TL)');
        expect(wrapper.find('.country-info').html()).toContain('Testville');
        expect(wrapper.find('#map-preview').exists()).toBe(true);
    });

    // TEST 7: 
    it('displays API error message when an API error occurs and not loading', async () => {
        mockApiError.value = 'Network Failure';
        mockIsLoading.value = false;
        mockCountryData.value = null;
        mockFormErrors.value = {};
        await wrapper.vm.$nextTick();

        expect(wrapper.find('.error-message').exists()).toBe(true);
        expect(wrapper.find('.error-message').text()).toBe('Network Failure');
    });
});