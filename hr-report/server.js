const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { generateReportsZip } = require('./scripts/generate');

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = process.env.PORT || 4000;

app.use(cors());

// POST /generate: expects multipart/form-data with 'file' (JSON) and 'period'
app.post('/generate', upload.single('file'), async (req, res) => {
  try {
    const period = req.body.period;
    if (!req.file || !period) {
      return res.status(400).json({ error: 'Missing file or period' });
    }
    const inputPath = req.file.path;
    const inputData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
    const outDir = path.resolve('server-output');
    const zipPath = await generateReportsZip({ inputData, period, outDir });
    res.download(zipPath, (err) => {
      fs.unlinkSync(inputPath); // Clean up uploaded file
      fs.unlinkSync(zipPath); // Clean up zip after sending
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
