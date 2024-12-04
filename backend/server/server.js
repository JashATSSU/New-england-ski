const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AWS = require('aws-sdk');
const loginRoute = require('./routes/userLogin');
const getAllUsersRoute = require('./routes/userGetAllUsers');
const registerRoute = require('./routes/userSignUp');
const getUserByIdRoute = require('./routes/userGetUserById');
const editUser = require('./routes/userEditUser');
const deleteUser = require('./routes/userDeleteAll');
const skiResortsRoute = require('./routes/skiResorts');
const User = require('./models/userModel'); // Import User model for updating profile picture
const uploadImagesRoute = require('./routes/upload-images');

dotenv.config();

const app = express();
const SERVER_PORT = 8081; // Port for the server

// Connect to MongoDB
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

// Middleware setup
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' })); // Increase limit for larger images

// User-related routes
app.use('/user', loginRoute);
app.use('/user', registerRoute);
app.use('/user', getAllUsersRoute);
app.use('/user', getUserByIdRoute);
app.use('/user', editUser);
app.use('/user', deleteUser);
app.use('/api', uploadImagesRoute); // Route for image uploads

// Ski resorts route
app.use('/api/resortview', skiResortsRoute);

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

// Route to get resorts data
app.get('/api/resorts', (req, res) => {
  res.json(resorts);  // Send the resorts data as JSON
});

// Configure AWS SDK for S3
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// Endpoint to upload profile picture
app.post('/api/upload-profile-picture', async (req, res) => {
  const { image, userId } = req.body; // Get the base64 image string and userId

  // Convert base64 string to a Buffer
  const buffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');

  const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `SkiResortProfilePictures/${Date.now()}.png`, // Use a unique name for the file
      Body: buffer,
      ContentType: 'image/png',
  };

  try {
      const data = await s3.upload(params).promise();
      console.log("Uploaded to S3:", data.Location);
      
      // Update user's profile picture URL in MongoDB
      const updatedUser = await User.findByIdAndUpdate(userId, { profilePictureUrl: data.Location }, { new: true });
      
      if (!updatedUser) {
          console.error("User not found:", userId);
          return res.status(404).json({ error: 'User not found' });
      }

      console.log("User updated:", updatedUser);
      res.json({ imageUrl: data.Location, user: updatedUser });
  } catch (error) {
      console.error('Error uploading file to S3 or updating MongoDB:', error);
      res.status(500).json({ error: 'Error uploading file to S3 or updating MongoDB', details: error });
  }
});

// Start server
app.listen(SERVER_PORT, () => {
  console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
});
