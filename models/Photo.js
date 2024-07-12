const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const photoSchema = new Schema({
  imagePath: String, // Assuming imagePath stores base64 encoded data
  timestamp: String,
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
