const { processPhoto } = require('../services/photoService');
const photoService = require('../services/photoService');

// Example controller function to get all photos with URLs
const getAllPhotosWithUrls = async (req, res) => {
  try {
    const photosWithUrls = await photoService.getAllPhotosWithUrls();
    res.json(photosWithUrls);
  } catch (error) {
    console.error('Error getting photos with URLs:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getPhotoById = async (req, res) => {
  const { photoId } = req.params;
  try {
    const photo = await photoService.getPhotoById(photoId);

    // Assuming imagePath contains base64 encoded data
    const imgBuffer = Buffer.from(photo.imagePath, 'base64');
    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length': imgBuffer.length,
    });
    res.end(imgBuffer);

  } catch (error) {
    console.error('Error getting photo by id:', error.message);
    res.status(404).json({ error: 'Photo not found' });
  }
};

module.exports = {
  getAllPhotosWithUrls, 
  processPhoto,
  getPhotoById,
};
