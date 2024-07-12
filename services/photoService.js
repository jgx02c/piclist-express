const mongoose = require('mongoose');
const Photo = require('../models/Photo'); // Assuming you have a Photo model defined
const { callGoogleAPI } = require('./externalServices'); // Import your external service function

const processPhoto = async (req, res) => {
  try {
    const { photo, timestamp } = req.body;

    console.log('Received request to process photo');
    console.log('Photo data:', photo ? 'Received' : 'Missing');
    console.log('Timestamp:', timestamp);

    if (!photo || !timestamp) {
      throw new Error('Photo data or timestamp is missing or invalid');
    }

    // Save photo and other data to MongoDB using Mongoose
    const savedPhoto = await Photo.create({
      imagePath: photo, // Assuming 'photo' contains the base64 data
      timestamp: timestamp.toString(), // Store timestamp as a string
    });

    console.log('Saved photo to MongoDB:', savedPhoto);

    // Call external service after photo is saved
    await callGoogleAPI(savedPhoto._id); // Pass _id as the identifier

    res.json({ imagePath: savedPhoto.imagePath, timestamp: savedPhoto.timestamp, _id: savedPhoto._id });
  } catch (error) {
    console.error('Error processing photo:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to fetch all photos and assign URLs
const getAllPhotosWithUrls = async () => {
  try {
    const photos = await Photo.find();
    const photosWithUrls = photos.map(photo => ({
      _id: photo._id,
      url: `/api/photos/${photo._id}`, // Assuming you want the URL to be relative
    }));
    return photosWithUrls;
  } catch (error) {
    console.error('Error fetching photos with URLs:', error.message);
    throw error;
  }
};

// Function to fetch a photo by _id
const getPhotoById = async (photoId) => {
  try {
    const photo = await Photo.findById(photoId);
    if (!photo) {
      throw new Error('Photo not found');
    }
    return photo;
  } catch (error) {
    console.error('Error fetching photo by id:', error.message);
    throw error;
  }
};

module.exports = {
  processPhoto,
  getAllPhotosWithUrls,
  getPhotoById,
};
