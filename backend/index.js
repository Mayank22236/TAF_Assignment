const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// POST /format-Json
app.post('/format-Json', (req, res) => {
  const { json } = req.body;
  try {
    const parsed = JSON.parse(json);
    const formatted = JSON.stringify(parsed, null, 2);
    res.json({ success: true, formatted });
  } catch (e) {
    res.status(400).json({ success: false, error: 'Invalid JSON' });
  }
});

// POST /encode
app.post('/encode', (req, res) => {
  const { text } = req.body;
  try {
    const encoded = Buffer.from(text, 'utf-8').toString('base64');
    res.json({ success: true, encoded });
  } catch (e) {
    res.status(400).json({ success: false, error: 'Encoding failed' });
  }
});

// POST /decode
app.post('/decode', (req, res) => {
  const { base64 } = req.body;
  try {
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    res.json({ success: true, decoded });
  } catch (e) {
    res.status(400).json({ success: false, error: 'Decoding failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Dev Toolbox backend running on http://localhost:${PORT}`);
});
