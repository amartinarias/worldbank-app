// useWorldBank.js
import { ref } from 'vue';
import axios from 'axios';

export function useWorldBankApi() {
    const countryData = ref(null);
    const error = ref(null);
    const isLoading = ref(false);

    // Function to fetch data
    const fetchCountry = async (isoCode) => {
        isLoading.value = true;
        countryData.value = null;
        error.value = null;

        const apiUrl = `http://localhost:3000/api/country/${isoCode}`;

        try {
            // Make the API call using axios
            const response = await axios.get(apiUrl);

            // --- ARTIFICIAL DELAY FOR TESTING ---
            // const artificialDelayMs = 2500; // Delay for 2.5 seconds
            // console.log(`[Server] Introducing an artificial delay of ${artificialDelayMs}ms...`);
            // await new Promise(resolve => setTimeout(resolve, artificialDelayMs));
            // --- END OF ARTIFICIAL DELAY ---

            countryData.value = response.data; // On success, store the data
        } catch (err) {
            console.error('[Composable] Error fetching country data:', err);
            error.value = err.response?.data?.error || err.message || 'An error occurred while fetching data.';
        } finally {
            isLoading.value = false;
        }
    };

    return {
        countryData,
        error,
        isLoading,
        fetchCountry
    };
}