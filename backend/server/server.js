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

dotenv.config();

const app = express();
const SERVER_PORT = 8081;

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

// Ski resorts route
app.use('/api/resortview', skiResortsRoute);

// Configure AWS SDK for S3
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

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
      res.json({ imageUrl: data.Location, updatedUser });
  } catch (error) {
      console.error('Error uploading file to S3 or updating MongoDB:', error);
      res.status(500).json({ error: 'Error uploading file to S3 or updating MongoDB', details: error });
  }
});

// Start server
app.listen(SERVER_PORT, () => {
  console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
});
