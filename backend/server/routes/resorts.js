const express = require('express');
const router = express.Router();
const { fetchResorts } = require('../utilities/api'); // Adjust path as needed

router.get('/', async (req, res) => {
  try {
    const resorts = await fetchResorts();
    res.json(resorts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resorts' });
  }
});

module.exports = router;
