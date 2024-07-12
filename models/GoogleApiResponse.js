const mongoose = require('mongoose');

const GoogleApiResponseSchema = new mongoose.Schema({
  imagePath: String,
  data: mongoose.Schema.Types.Mixed,
  timestamp: Date
});

module.exports = mongoose.model('GoogleApiResponse', GoogleApiResponseSchema);
