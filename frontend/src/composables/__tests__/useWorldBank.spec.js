// useWorldBank.spec.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWorldBankApi } from '../useWorldBank';
import axios from 'axios';

// Mock the axios module. All calls to axios.get will be intercepted.
vi.mock('axios');

describe('useWorldBankApi', () => {
    let countryData, error, isLoading, fetchCountry;

    beforeEach(() => {
        // Reset axios mocks before each test to clear call history etc.
        axios.get.mockReset();

        // Initialize a fresh instance of the composable before each test.
        const composableResult = useWorldBankApi();
        countryData = composableResult.countryData;
        error = composableResult.error;
        isLoading = composableResult.isLoading;
        fetchCountry = composableResult.fetchCountry;
    });

    // TEST 1
    it('initializes with correct default states', () => {
        expect(countryData.value).toBeNull();
        expect(error.value).toBeNull();
        expect(isLoading.value).toBe(false);
    });

    // TEST 2
    it('fetchCountry sets isLoading to true while fetching and false afterwards', async () => {
        // Arrange: Mock a successful API response.
        axios.get.mockResolvedValue({ data: { name: 'Testland' } });

        // Act: Initiate the fetchCountry call.
        const fetchPromise = fetchCountry('TL');
        // Assert: isLoading should be true immediately after calling fetchCountry.
        expect(isLoading.value).toBe(true);

        // Act: Wait for the API call (and its internal processing) to complete.
        await fetchPromise;
        // Assert: isLoading should be false after the fetch operation concludes.
        expect(isLoading.value).toBe(false);
    });

    // TEST 3: 
    it('fetchCountry successfully fetches and sets countryData', async () => {
        // Arrange: Define mock data and mock a successful API response.
        const mockCountry = { id: 'US', name: 'United States' };
        axios.get.mockResolvedValue({ data: mockCountry });

        // Act: Call fetchCountry with a test ISO code.
        await fetchCountry('US');

        // Assert: Check the final states and that axios.get was called correctly.
        expect(isLoading.value).toBe(false);
        expect(countryData.value).toEqual(mockCountry);
        expect(error.value).toBeNull();
        expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/country/US');
    });

    // TEST 4: 
    it('fetchCountry handles API error (from server response) correctly', async () => {
        // Arrange: Define an error message and mock an API error response structure.
        const errorMessage = 'Country not found on our server';
        axios.get.mockRejectedValue({ response: { data: { error: errorMessage } } });

        // Act: Call fetchCountry with an ISO code expected to cause this error.
        await fetchCountry('XX');

        // Assert: Check that isLoading is false, countryData is null, and error state is set.
        expect(isLoading.value).toBe(false);
        expect(countryData.value).toBeNull();
        expect(error.value).toBe(errorMessage);
    });

    // TEST 5: 
    it('fetchCountry handles network or other generic errors correctly', async () => {
        // Arrange: Define a generic error message and mock a generic error.
        const genericErrorMessage = 'Network Error Occurred';
        axios.get.mockRejectedValue(new Error(genericErrorMessage));

        // Act: Call fetchCountry.
        await fetchCountry('YY');

        // Assert: Check states for error handling.
        expect(isLoading.value).toBe(false);
        expect(countryData.value).toBeNull();
        expect(error.value).toBe(genericErrorMessage);
    });

    // TEST 6: 
    it('fetchCountry resets countryData and error before a new successful fetch', async () => {
        // Arrange:
        // First successful fetch to populate data.
        axios.get.mockResolvedValueOnce({ data: { name: 'Oldland' } });
        await fetchCountry('OL');
        expect(countryData.value.name).toBe('Oldland');

        // Mock setup for the second fetch.
        axios.get.mockResolvedValueOnce({ data: { name: 'Newland' } });

        // Act: Perform a second fetch.
        await fetchCountry('NL');

        // Assert: Verify new data is set and previous error is cleared.
        expect(countryData.value.name).toBe('Newland');
        expect(error.value).toBeNull();
    });
});