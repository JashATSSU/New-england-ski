const axios = require('axios');

const fetchResorts = async () => {
  try {
    const response = await axios.get('https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort', {
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,  // Add your RapidAPI key in the .env file
        'X-RapidAPI-Host': 'ski-resorts-and-conditions.p.rapidapi.com'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching resorts:', error);
    throw error;
  }
};

module.exports = { fetchResorts };
