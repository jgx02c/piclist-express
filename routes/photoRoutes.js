const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');

router.post('/processPhoto', photoController.processPhoto);
router.get('/allWithUrls', photoController.getAllPhotosWithUrls);
router.get('/:photoId', photoController.getPhotoById);

module.exports = router;
