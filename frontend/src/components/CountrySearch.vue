<script setup>
import { ref } from "vue";

const isoCode = ref("");
const countryData = ref(null);
const error = ref(null);
const message = ref("Enter a code and click search.");

const handleSearch = () => {
  console.log("Searching for:", isoCode.value);
  // Test code to simulate a search
  if (isoCode.value.toUpperCase() === "US") {
    countryData.value = { name: "United States", capital: "Washington D.C." }; // Dummy data
    error.value = null;
    message.value = "";
  } else if (isoCode.value) {
    error.value = `No data found for ${isoCode.value}.`;
    countryData.value = null;
    message.value = "";
  } else {
    error.value = "Please enter an ISO code.";
    countryData.value = null;
    message.value = "";
  }
  console.log("Search completed.", message.value);
};
</script>

<template>
  <div class="country-search-container">
    <input
      type="text"
      v-model="isoCode"
      placeholder="Enter ISO Code (e.g., US, SPA)"
    />
    <button @click="handleSearch">Search</button>
    <div class="results-area">
      <p v-if="!countryData && !error">{{ message }}</p>
      <div v-if="countryData">
        Name: {{ countryData.name }} Capital: {{ countryData.name }}
      </div>
      <div v-if="error">{{ error }}</div>
    </div>
  </div>
</template>

<style scoped>
.country-search-container {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
}
input[type="text"] {
  padding: 8px;
  margin-right: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
button {
  padding: 8px 15px;
  border-radius: 4px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #369f71;
}
.results-area {
  margin-top: 20px;
  padding: 15px;
  border: 1px dashed #eee;
  min-height: 50px;
}
</style>
