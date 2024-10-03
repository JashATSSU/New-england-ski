// skiResorts.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Endpoint to fetch resort details
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    const response = await axios.get(`https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort/${slug}`, {
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching the resort', error);
    res.status(500).json({ error: 'Failed to fetch the resort' });
  }
});

// New endpoint to fetch forecast
router.get('/:slug/forecast', async (req, res) => {
  const { slug } = req.params;

  try {
    const forecastResponse = await axios.get(`https://ski-resort-forecast.p.rapidapi.com/${slug}/forecast`, {
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RESORT_FORECAST_HOST,
      },
      params: {
        units: 'i',
        el: 'top',
      },
    });
    res.json(forecastResponse.data);
  } catch (error) {
    console.error('Error fetching the forecast', error);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

// New endpoint to fetch hourly forecast
router.get('/:slug/hourly', async (req, res) => {
  const { slug } = req.params;

  try {
    const hourlyResponse = await axios.get(`https://ski-resort-forecast.p.rapidapi.com/${slug}/hourly`, {
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RESORT_FORECAST_HOST,
      },
      params: {
        units: 'i',
        el: 'top',
        c: false,
      },
    });
    res.json(hourlyResponse.data);
  } catch (error) {
    console.error('Error fetching hourly forecast', error);
    res.status(500).json({ error: 'Failed to fetch hourly forecast' });
  }
});

module.exports = router;
