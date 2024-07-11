const axios = require('axios');

module.exports = async (req, res) => {
  const { item } = req.body;

  try {
    const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
      prompt: `Generate a detailed description for an item named ${item.name}`,
      max_tokens: 150
    }, {
      headers: {
        'Authorization': `Bearer YOUR_OPENAI_API_KEY`
      }
    });

    res.json({ description: response.data.choices[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating description');
  }
};
