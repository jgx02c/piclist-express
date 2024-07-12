const mongoose = require('mongoose');

const OpenAIResponseSchema = new mongoose.Schema({
  userMessage: String,
  response: String,
  timestamp: Date
});

module.exports = mongoose.model('OpenAIResponse', OpenAIResponseSchema);
