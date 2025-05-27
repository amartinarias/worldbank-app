// useWorldBank.js
import { ref } from 'vue';
import axios from 'axios';

export function useWorldBankApi() {
    // Reactive state (Only data and error)
    const countryData = ref(null);
    const error = ref(null);

    // Function to fetch data
    const fetchCountry = async (isoCode) => {
        // 1. Clear previous data/errors
        countryData.value = null;
        error.value = null;

        // 2. Define the URL to your backend
        const apiUrl = `http://localhost:3000/api/country/${isoCode}`;

        try {
            // 3. Make the API call using axios
            const response = await axios.get(apiUrl);
            countryData.value = response.data; // On success, store the data
        } catch (err) {
            // 4. Handle errors
            console.error('[Composable] Error fetching country data:', err);
            // Store a user-friendly error message.
            error.value = err.response?.data?.error || err.message || 'An error occurred while fetching data.';
        }
    };

    // 5. Expose the reactive state and the fetch function
    return {
        countryData,
        error,
        fetchCountry
    };
}