<script setup>
import { useWorldBankApi } from "../composables/useWorldBank";
import { useSimpleForm } from "../composables/useSimpleForm";
import { worldBankSchema } from "../schemas/validationSchemas";

// Call the composable to get its state and methods
const { countryData, error, fetchCountry, isLoading } = useWorldBankApi();
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
      <img
        src="/assets/world-bank-logo.svg"
        alt="World Bank Icon"
        class="app-icon"
      />
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
      <div v-if="isLoading" class="loading-display">
        <div class="spinner"></div>
        <p class="loading-message-text">Fetching data...</p>
      </div>
      <div v-if="error && !isLoading" class="error-message">{{ error }}</div>
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
.loading-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #777;
  font-style: italic;
  padding: 30px 0;
  width: 100%;
}

.spinner {
  border: 5px solid rgba(128, 128, 128, 0.2);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border-left-color: #6b49bf;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-message-text {
  font-size: 0.95em;
}

.country-search-container {
  background-color: #ffffff;
  max-width: 650px;
  width: 100%;
  margin-top: 20px;
  padding: 30px 35px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  color: #141414;
  text-align: center;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.app-icon {
  width: 36px;
  height: 36px;
  vertical-align: middle;
}

.app-title {
  font-size: 2.2em;
  color: #6b49bf;
  font-weight: bold;
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
  color: #555;
  font-size: 0.95em;
}

input[type="text"] {
  padding: 10px 15px;
  border-radius: 6px;
  border: 1px solid #aeb5bd;
  font-size: 1.1em;
  text-align: center;
  width: 180px;
  color: #141414;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input[type="text"]:focus {
  outline: none;
  border-color: #6b49bf;
  box-shadow: 0 0 0 3px rgba(107, 73, 191, 0.2);
}

input[type="text"]:focus::placeholder {
  color: transparent;
  -webkit-text-fill-color: transparent;
}

input.input-error {
  border-color: #ff6e6e !important;
  background-color: #fff5f5;
}

.search-button {
  padding: 10px 25px;
  border-radius: 6px;
  background-color: #4f2ba9;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  transition: background-color 0.2s, transform 0.1s;
}

.search-button:hover {
  background-color: #3e218b;
  transform: translateY(-1px);
}

.search-button:disabled {
  background-color: #d1c2f6;
  color: #8c80b1;
  cursor: not-allowed;
  transform: translateY(0);
}

.validation-error {
  color: #ff6e6e;
  font-size: 0.9em;
  min-height: 1.3em;
  font-weight: 500;
}

.results-area {
  margin-top: 20px;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  min-height: 150px;
  text-align: left;
}

.country-info h2 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #46d2be;
  font-size: 1.4em;
  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.country-info p {
  margin: 8px 0;
  font-size: 1em;
  color: #555;
  display: flex;
}

.country-info strong {
  font-weight: 600;
  color: #141414;
  width: 120px;
  flex-shrink: 0;
  margin-right: 8px;
}
.country-info span {
  flex-grow: 1;
}

.error-message {
  color: #ff6e6e;
  background-color: #ffe0e0;
  border: 1px solid #ffbdc3;
  padding: 15px;
  border-radius: 6px;
  font-weight: 500;
  text-align: center;
}

.loading-message,
.initial-message {
  color: #777;
  font-style: italic;
  text-align: center;
  padding: 30px 0;
}

.app-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--color-grey-light);
  font-size: 0.85em;
  color: var(--text-color-secondary, #777);
  text-align: center;
}

.footer-line {
  margin-bottom: 4px;
}
.footer-line:last-child {
  margin-bottom: 0;
}
</style>