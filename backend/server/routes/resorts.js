const express = require('express');
const router = express.Router();

// Hardcoded resorts data
const resorts = [
  { id: 1, name: 'Attitash Mountain', webcam: ['https://www.youtube.com/embed/B32BbIXgHWw'] },
  { id: 2, name: 'Bolton Valley', webcam: ['https://www.youtube.com/embed/xWdZHDUHjv8'] },
  { id: 3, name: 'Loon Mountain', webcam: ['https://www.youtube.com/embed/5NUYOuzzZwc', 'https://www.youtube.com/embed/1ulgeNTlFJc'] },
  { id: 4, name: 'Mad River Glen', webcam: ['https://www.youtube.com/embed/zMuhC48767w'] },
  { id: 5, name: 'Mount Katahdin', webcam: ['https://www.youtube.com/embed/yPyOLnDcrHA'] },
  { id: 6, name: 'Mount Washington', webcam: ['https://www.youtube.com/embed/5qVHjf7hKZU'] },
  { id: 7, name: 'Pats Peak', webcam: ['https://www.youtube.com/embed/ZLsh8WsISr0', 'https://www.youtube.com/embed/KFjl8wPJvyg'] },
  { id: 8, name: 'Stowe', webcam: ['https://www.youtube.com/embed/AhcH03HwuH0'] },
  { id: 9, name: 'Stratton Mountain', webcam: ['https://www.youtube.com/embed/AhcH03HwuH0', 'https://www.youtube.com/embed/VPQaZffyviI'] },
  { id: 10, name: 'Sugarbush', webcam: ['https://www.youtube.com/embed/tdQOYaEQC3o'] },
  { id: 11, name: 'Sugarloaf', webcam: ['https://www.youtube.com/embed/K77ahIkmPGw'] },
  { id: 12, name: 'Sunday River', webcam: ['https://www.youtube.com/embed/J98tW5YX4Z8'] },
];

// Endpoint to serve resorts data
router.get('/resorts', (req, res) => {
  res.json(resorts);  // Send the resorts data as JSON
});

module.exports = router;
