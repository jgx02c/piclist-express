const axios = require('axios');

module.exports = async (req, res) => {
  const { item, description } = req.body;

  try {
    await axios.post('https://api.ebay.com/sell/inventory/v1/inventory_item', {
      title: item.name,
      description: description,
      // Add other required fields for eBay listing
    }, {
      headers: {
        'Authorization': `Bearer YOUR_EBAY_API_KEY`
      }
    });

    res.send('Item listed successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error listing item on eBay');
  }
};
