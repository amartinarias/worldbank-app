// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

// --- Middleware ---
app.use(cors()); // Enable CORS - Necessary for frontend communication

// --- API Route ---
app.get('/api/country/:code', async (req, res) => {
    // 1. Get the ISO code 
    const isoCode = req.params.code;

    // 2. Construct the World Bank API URL
    const worldBankUrl = `http://api.worldbank.org/v2/country/${isoCode}?format=json`;

    console.log(`[Server] Requesting: ${worldBankUrl}`);

    try {
        // 3. Call the World Bank API
        const response = await axios.get(worldBankUrl);
        const data = response.data;

        console.log(`[Server] Response received:`, data);
        // 4. Check response & extract data
        if (data && data.length > 1 && data[1] && data[1].length > 0) {
            const countryData = data[1][0];
            // 5a. Send success response
            res.status(200).json(countryData);
        } else {
            // 5b. Send 'Not Found' response
            res.status(404).json({ error: `No data found for ISO code "${isoCode}".` });
        }
    } catch (error) {
        // 6. Handle errors
        console.error('[Server] API call failed:', error.message);

        const wbError = error.response?.data?.[0]?.message?.[0]?.value;
        res.status(error.response?.status || 500).json({
            error: wbError || 'Server failed to fetch data.'
        });
    }
});

// --- Start the Server ---
app.listen(port, () => {
    console.log(`[Server] Listening on http://localhost:${port}`);
});