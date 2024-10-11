const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateAccessToken = (userId, email, username, profilePictureUrl) => {
    return jwt.sign(
        { id: userId, email, username, profilePictureUrl }, // Include the new field here
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1m' }
    );
};

module.exports.generateAccessToken = generateAccessToken;
