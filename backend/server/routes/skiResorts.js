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
    res.json(response.data); // Return the data to the frontend
  } catch (error) {
    console.error('Error fetching the resort', error);
    res.status(500).json({ error: 'Failed to fetch the resort' });
  }
});

module.exports = router;
