const express = require('express');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const router = express.Router(); // Create a router instance

// Initialize S3 client
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Directory where your images are located
const folderPath = path.join(__dirname, '../public/SkiMaps');

// Function to upload a single file to S3
const uploadFile = (fileName) => {
    const fileContent = fs.readFileSync(path.join(folderPath, fileName));

    // Determine the content type based on the file extension
    const fileExtension = path.extname(fileName).toLowerCase();
    let contentType;

    if (fileExtension === '.png') {
        contentType = 'image/png';
    } else if (fileExtension === '.jpeg' || fileExtension === '.jpg') {
        contentType = 'image/jpeg';
    } else if (fileExtension === '.gif') {
        contentType = 'image/gif';
    } else {
        contentType = 'application/octet-stream'; // Fallback for unknown types
    }

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `SkiMaps/${fileName}`,
        Body: fileContent,
        ACL: 'public-read', // Makes the file publicly readable
        ContentType: contentType,
    };

    return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
            if (err) {
                reject(`Error uploading ${fileName}: ${err}`);
            } else {
                resolve(data.Location); // Return the S3 URL of the uploaded file
            }
        });
    });
};

// Route to upload all images in the folder
router.post('/upload-images', async (req, res) => {
    try {
        const files = fs.readdirSync(folderPath);
        const uploadPromises = files.map(file => uploadFile(file));
        const uploadedUrls = await Promise.all(uploadPromises);

        // Construct the URLs to access the images
        const imageUrls = uploadedUrls.map(url => ({
            url,
            s3Url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/SkiMaps/${path.basename(url)}`
        }));

        res.json({ message: 'Files uploaded successfully', urls: imageUrls });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ error: 'Error uploading files', details: error });
    }
});

// Export the router
module.exports = router;
