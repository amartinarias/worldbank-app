# World Bank Country Info Lookup

## 🌍 Description

This is a simple web application designed to fetch and display key information about a country using the public World Bank API. Users can enter a 2 or 3-letter ISO country code (like `GB`, `USA`, or `JPN`) and, if the code is valid, the application will display:

* Country Name
* Region
* Capital City
* Longitude
* Latitude

The application includes basic input validation and provides user-friendly error messages for invalid inputs or API issues.

## ✨ Features

* ISO Code Input (2-3 letters)
* Client-side Input Validation
* World Bank API Integration
* Clear Display of Country Data
* Error Message Handling
* Loading States
* Responsive Design
* Map Preview with Leaflet


## 🛠️ Tech Stack

**Frontend:**

* Vue.js (v3)
* Vite
* JavaScript
* Axios (for API calls from frontend composable to backend)
* Leaflet.js (for map display)
* Yup (for form validation)
* CSS3

**Backend:**

* Node.js
* Express.js
* Axios (for API calls from backend to World Bank API)
* CORS

**Testing:**

* Vitest
* Vue Test Utils
* happy-dom

**Version Control:**

* Git

## 🔑 Prerequisites

* Node.js (v16.x or later recommended - please specify if you used a particular version)
* npm (v8.x or later recommended) or yarn

## ⚙️ Setup and Installation

1.  **Clone the repository (if applicable, or download the source code):**
    ```bash
    git clone <your-repository-url>
    cd worldbank-app
    ```

2.  **Install Backend Dependencies:**
    Navigate to the project's root directory (`worldbank-app`) and run:
    ```bash
    npm install
    ```
    This will install Express, Axios (for the server), and CORS.

3.  **Install Frontend Dependencies:**
    Navigate to the `frontend` directory and run:
    ```bash
    cd frontend
    npm install
    ```
    This will install Vue, Vite, Leaflet, Yup, Axios (for the frontend), and testing libraries.

## 🚀 Running the Application

You will need two terminal windows open to run both the backend and frontend servers.

1.  **Start the Backend Server:**
    * Navigate to the project's root directory (`worldbank-app`).
    * Run the command:
        ```bash
        node server.js
        ```

2.  **Start the Frontend Development Server:**
    * Open a new terminal window.
    * Navigate to the `frontend` directory (`worldbank-app/frontend`).
    * Run the command:
        ```bash
        npm run dev
        ```

3.  **Access the Application:**
    * Open your web browser and go to the URL provided by the Vite development server.

## 🧪 Running Tests

Tests are written for the frontend application using Vitest.

1.  **Navigate to the Frontend Directory:**
    ```bash
    cd frontend
    ```

2.  **Run All Tests Once:**
    ```bash
    npm test
    ```
  
3.  **Generate Test Coverage Report:**
    ```bash
    npm run coverage
    ```
