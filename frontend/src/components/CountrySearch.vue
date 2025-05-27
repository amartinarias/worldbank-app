<script setup>
import { ref } from "vue";
import { useWorldBankApi } from "../composables/useWorldBank";
import { useSimpleForm } from "../composables/useSimpleForm";
import { worldBankSchema } from "../schemas/validationSchemas";

// Call the composable to get its state and methods
const { countryData, error, fetchCountry } = useWorldBankApi();
const { formData, formErrors, validateForm, updateField } = useSimpleForm(
  { isoCode: "" },
  worldBankSchema
);

/**
 * @description Validates user input and initiates the API call
 * to fetch country data if validation passes.
 */
async function handleSearch() {
  const isFormValid = await validateForm();

  //nIf valid, call the API composable's fetch function
  if (isFormValid) {
    await fetchCountry(formData.value.isoCode);
  }
}
</script>
<template>
  <div class="country-search-container">
    <header class="app-header">
      <svg
        class="app-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        width="32px"
        height="32px"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2-15.86c3.95.49 7 3.85 7 7.93s-3.05 7.44-7 7.93V4.07z"
        />
      </svg>
      <h1 class="app-title">Country Data Finder</h1>
    </header>

    <div class="search-box">
      <label for="isoInput">Enter Country ISO Code:</label>
      <input
        type="text"
        id="isoInput"
        :value="formData.isoCode"
        @input="updateField('isoCode', $event.target.value)"
        placeholder="e.g., US, GBR"
        maxlength="3"
        :class="{ 'input-error': formErrors.isoCode }"
        @keyup.enter="handleSearch"
      />
      <button @click="handleSearch" :disabled="isLoading" class="search-button">
        {{ isLoading ? "Searching..." : "Search" }}
      </button>
      <small class="validation-error" v-if="formErrors.isoCode">
        {{ formErrors.isoCode }}
      </small>
    </div>

    <div class="results-area">
      <div v-if="isLoading" class="loading-message">Fetching data...</div>
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="countryData && !isLoading" class="country-info">
        <h2>{{ countryData.name }} ({{ countryData.iso2Code }})</h2>
        <p>
          <strong>Capital:</strong>
          <span>{{ countryData.capitalCity || "N/A" }}</span>
        </p>
        <p>
          <strong>Region:</strong>
          <span>{{ countryData.region?.value || "N/A" }}</span>
        </p>
        <p>
          <strong>Income Level:</strong>
          <span>{{ countryData.incomeLevel?.value || "N/A" }}</span>
        </p>
        <p>
          <strong>Latitude:</strong>
          <span>{{ countryData.latitude || "N/A" }}</span>
        </p>
        <p>
          <strong>Longitude:</strong>
          <span>{{ countryData.longitude || "N/A" }}</span>
        </p>
      </div>
      <div
        v-if="!countryData && !error && !isLoading && !formErrors.isoCode"
        class="initial-message"
      >
        Enter a 2 or 3 letter ISO code to get country details.
      </div>
    </div>

    <footer class="app-footer">
      <div class="footer-line">
        Data provided by
        <a
          href="https://www.worldbank.org/"
          target="_blank"
          rel="noopener noreferrer"
          >The World Bank</a
        >
      </div>
      <div class="footer-line">
        Created by
        <a href="https://github.com/amartinarias" target="_blank"
          >Alice Martin</a
        >
      </div>
    </footer>
  </div>
</template>

<style scoped>
.country-search-container {
  background-color: #ffffff; /* White card on the EAEAEA background */
  max-width: 650px; /* A good medium width */
  width: 100%;
  margin-top: 20px; /* Let #app in global CSS handle overall centering */
  padding: 30px 35px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); /* Softer shadow */
  color: #141414; /* Using --color-dark from your palette */
  text-align: center;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0; /* Light grey border */
}

.app-icon {
  color: #6b49bf; /* Using --primary from your palette */
}

.app-title {
  font-size: 1.8em;
  color: #6b49bf; /* Using --primary from your palette */
  font-weight: 600;
  margin: 0;
}

.search-box {
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.search-box label {
  font-weight: 500;
  color: #555; /* Slightly lighter than main text */
  font-size: 0.95em;
}

input[type="text"] {
  padding: 10px 15px;
  border-radius: 6px;
  border: 1px solid #aeb5bd; /* Using --color-grey from your palette */
  font-size: 1.1em;
  text-align: center;
  width: 180px;
  color: #141414;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input[type="text"]:focus {
  outline: none;
  border-color: #6b49bf; /* Using --primary */
  box-shadow: 0 0 0 3px rgba(107, 73, 191, 0.2); /* Focus ring with primary color */
}

input[type="text"]:focus::placeholder {
  color: transparent;
  -webkit-text-fill-color: transparent;
}

input.input-error {
  border-color: #ff6e6e !important; /* Using --error */
  background-color: #fff5f5; /* Very light red */
}

.search-button {
  padding: 10px 25px;
  border-radius: 6px;
  background-color: #4f2ba9; /* Using --button-purple */
  color: #fff; /* Using --color-light */
  border: none;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  transition: background-color 0.2s, transform 0.1s;
}

.search-button:hover {
  background-color: #3e218b; /* Using your --button-purple-hover (or a derived darker) */
  transform: translateY(-1px);
}

.search-button:disabled {
  background-color: #d1c2f6; /* Using your --button-purple-disabled */
  color: #8c80b1;
  cursor: not-allowed;
  transform: translateY(0);
}

.validation-error {
  color: #ff6e6e; /* Using --error */
  font-size: 0.9em;
  min-height: 1.3em;
  font-weight: 500;
}

.results-area {
  margin-top: 20px;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9; /* Simple light grey for contrast */
  min-height: 150px;
  text-align: left;
}

.country-info h2 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #46d2be; /* Using --secondary / --valid */
  font-size: 1.4em;
  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0; /* Light grey border */
}

.country-info p {
  margin: 8px 0;
  font-size: 1em;
  color: #555; /* Lighter text for details */
  display: flex;
}

.country-info strong {
  font-weight: 600;
  color: #141414; /* Darker text for labels */
  width: 120px;
  flex-shrink: 0;
  margin-right: 8px;
}
.country-info span {
  flex-grow: 1;
}

.error-message {
  color: #ff6e6e; /* Using --error */
  background-color: #ffe0e0; /* Light red based on your --error */
  border: 1px solid #ffbdc3;
  padding: 15px;
  border-radius: 6px;
  font-weight: 500;
  text-align: center;
}

.loading-message,
.initial-message {
  color: #777; /* Slightly darker grey */
  font-style: italic;
  text-align: center;
  padding: 30px 0;
}

.app-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
  font-size: 0.85em;
  color: #777;
  text-align: center;
}
</style>