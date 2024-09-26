const mongoose = require("mongoose");

// User schema/model
const newUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    label: "username",
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email is unique
    label: "email",
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  profilePictureUrl: {
    type: String, // Field for the profile picture URL
    default: "arn:aws:s3:::capstone-project-2024/SkiResortProfilePictures/", 

  },
}, { collection: 'users' }); // Collection name

module.exports = mongoose.model("User", newUserSchema); // Use 'User' for consistency
