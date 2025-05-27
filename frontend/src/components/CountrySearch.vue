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

const apiError = ref(null);

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
    <div class="search-box">
      <label for="isoInput">Enter ISO Code:</label>
      <input
        type="text"
        id="isoInput"
        :value="formData.isoCode"
        @input="updateField('isoCode', $event.target.value)"
        placeholder="Enter ISO Code"
        maxlength="3"
        :class="{ 'input-error': formErrors.isoCode }"
        @keyup.enter="handleSearch"
      />
      <button @click="handleSearch">Search</button>
      <small class="validation-error" v-if="formErrors.isoCode">
        {{ formErrors.isoCode }}
      </small>
    </div>

    <div class="results-area">
      <div v-if="apiError" class="error-message">{{ apiError }}</div>

      <div v-if="countryData" class="country-info">
        <h2>{{ countryData.name }} ({{ countryData.iso2Code }})</h2>
        <p><strong>Capital:</strong> {{ countryData.capitalCity || "N/A" }}</p>
        <p><strong>Region:</strong> {{ countryData.region?.value || "N/A" }}</p>
        <p>
          <strong>Income Level:</strong>
          {{ countryData.incomeLevel?.value || "N/A" }}
        </p>
        <p><strong>Latitude:</strong> {{ countryData.latitude || "N/A" }}</p>
        <p><strong>Longitude:</strong> {{ countryData.longitude || "N/A" }}</p>
      </div>

      <div
        v-if="!countryData && !apiError && !formErrors.isoCode"
        class="initial-message"
      >
        Enter a 2 or 3 letter ISO code.
      </div>
    </div>
  </div>
</template>

<style scoped>
.country-search-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.search-box {
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.search-box label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}
input[type="text"] {
  padding: 10px 15px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1.1em;
  text-align: center;
  width: 150px;
  text-transform: uppercase;
  transition: border-color 0.2s, box-shadow 0.2s;
}
input[type="text"]:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}
input.input-error {
  border-color: #dc3545 !important;
}
button {
  padding: 10px 25px;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s;
}
button:hover {
  background-color: #0056b3;
}

.validation-error {
  color: #dc3545;
  font-size: 0.85em;
  min-height: 1.2em;
}
.results-area {
  margin-top: 20px;
  padding: 20px;
  border-radius: 4px;
  background-color: #f8f9fa;
  min-height: 150px;
  text-align: left;
}
.country-info h2 {
  margin-top: 0;
  color: #005a9c;
}
.country-info p {
  margin: 8px 0;
}
.country-info strong {
  display: inline-block;
  width: 110px;
}
.error-message {
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 15px;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
}
.initial-message {
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 20px 0;
}
</style>
