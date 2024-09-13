// routes/resorts.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Endpoint to fetch resorts
router.get('/resorts', async (req, res) => {
  try {
    const response = await axios.get('https://ski-resorts-and-conditions.p.rapidapi.com/v1/resorts', {
      headers: {
        'X-RapidAPI-Key': process.env._RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
      },
    });
    res.json(response.data); // Return the data to the frontend
  } catch (error) {
    console.error('Error fetching the resorts:', error);
    res.status(500).json({ error: 'Failed to fetch the resorts' });
  }
});

module.exports = router;
