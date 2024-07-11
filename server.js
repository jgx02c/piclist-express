const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { getJson } = require('serpapi'); // Assuming you have the `serpapi` module installed

dotenv.config(); // Load environment variables

// Middleware for CORS
app.use(cors());

// Increase payload size limit to 50MB (adjust as necessary)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Example API documentation
const apiDocumentation = {
  'Google Reverse Image API': {
    description: 'Allows to get results for image search',
    endpoint: '/search',
    documentationLink: 'https://serpapi.com/search?engine=google_reverse_image'
  },
  // Add more API documentation entries here
};

// Function to save received photos to 'images' folder with timestamp
const savePhoto = async (photoData, timestamp) => {
  const imageFileName = `${timestamp}.jpg`; // Assuming the photos are JPEG format
  const imagePath = path.join(__dirname, 'images', imageFileName);

  // Save photo data to file
  await fs.writeFile(imagePath, photoData, 'base64');

  return imagePath; // Return path to saved image
};

// Function to call Google API (serpapi) and fetch JSON data
const callGoogleAPI = async (imagePath) => {
  return new Promise((resolve, reject) => {
    getJson({
      engine: 'google_reverse_image',
      image_url: `file://${imagePath}`, // Replace with correct URL format for serpapi
      api_key: process.env.SERPAPI_API_KEY // Replace with your serpapi API key
    }, (json) => {
      if (json && json.inline_images) {
        resolve(json.inline_images); // Resolve with fetched JSON data
      } else {
        reject(new Error('Failed to fetch JSON data from Google API'));
      }
    });
  });
};

// Initialize OpenAI instance
const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to interact with OpenAI and get AI response
const getOpenAIResponse = async (userMessage) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: [
        { role: 'system', content: 'You are a helpful assistant. Your response should be in JSON format.' },
        { role: 'user', content: userMessage },
      ],
      response_format: { type: 'json_object' },
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching response from OpenAI:', error);
    return null;
  }
};

// Example API endpoint to handle photo processing and AI integration
app.post('/processPhoto', async (req, res) => {
  try {
    const { photo, timestamp, messageToAI } = req.body; // Assuming messageToAI is sent from the frontend

    if (!photo || !timestamp) {
      throw new Error('Photo data or timestamp is missing or invalid');
    }

    // Save received photo to 'images' folder with the provided timestamp
    const savedImagePath = await savePhoto(photo, timestamp);

    // Log saved image path for debugging
    console.log('Saved image path:', savedImagePath);

    // Call Google API (serpapi) to fetch JSON data
    const googleApiResponse = await callGoogleAPI(savedImagePath);

    // Log Google API response for debugging
    console.log('Google API response:', googleApiResponse);

    // If Google API returned valid JSON data, proceed with OpenAI
    if (googleApiResponse) {
      // Get AI response from OpenAI based on user message
      const aiResponse = await getOpenAIResponse(messageToAI);

      // Log AI response for debugging
      console.log('OpenAI response:', aiResponse);

      // Respond with success, saved image path, Google API response, and AI response
      res.json({ imagePath: savedImagePath, googleApiResponse, aiResponse });
    } else {
      throw new Error('Failed to fetch JSON data from Google API');
    }
  } catch (error) {
    console.error('Error processing photo:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for API documentation
app.get('/api/documentation', (req, res) => {
  res.json(apiDocumentation);
});

// Default route
app.get('/', (req, res) => {
  res.send('API Dashboard Home');
});

// Create 'images' directory if it doesn't exist
const imagesDir = path.join(__dirname, 'images');
fs.mkdir(imagesDir, { recursive: true })
  .then(() => {
    const port = process.env.PORT || 3000; // Use environment port or 3000 as default
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error creating images directory:', err);
  });
