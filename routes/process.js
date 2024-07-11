const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

module.exports = async (req, res) => {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(req.file.path));

  try {
    const response = await axios.post('https://lens.googleapis.com/v1/images:annotate', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer YOUR_GOOGLE_LENS_API_KEY`
      }
    });
    res.json(response.data.responses[0].labelAnnotations);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing image');
  }
};
