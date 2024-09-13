const express = require('express');
const axios = require('axios');
const router = express.Router();

require('dotenv').config();

const rapidApiKey = process.env.RAPIDAPI_KEY;

router.get('/resort', async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: 'localhost:8096//ski-resorts-and-conditions.p.rapidapi.com/v1/resort/whistler-blackcomb', // Change if you need a specific resort or list
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': 'ski-resorts-and-conditions.p.rapidapi.com'
      }
    };
    
    const response = await axios.request(options);
    res.json(response.data);  // Return the data to the frontend
  } catch (error) {
    console.error('Error fetching the resort:', error);
    res.status(500).json({ error: 'Failed to fetch the resort' });
  }
});

module.exports = router;
