const express = require('express');
const multer = require('multer');
const cors = require('cors');
const processRoute = require('./routes/process');
const generateDescriptionRoute = require('./routes/generateDescription');
const listItemRoute = require('./routes/listItem');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.post('/process', upload.single('photo'), processRoute);
app.post('/generate-description', generateDescriptionRoute);
app.post('/list-item', listItemRoute);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
