const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Shared file path (must match the generator container)
const STATUS_FILE = process.env.STATUS_FILE || '/shared/status.log';

// --- HTTP endpoint to get current status file contents ---
app.get('/status', (req, res) => {
  fs.readFile(STATUS_FILE, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(200).send('No data written yet.\n');
      }
      console.error('Error reading status file:', err);
      return res.status(500).send('Error reading status file.\n');
    }

    // Return the raw file contents so user can see all logged lines
    res.type('text/plain').send(data);
  });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Reader started on port ${PORT}, serving file: ${STATUS_FILE}`);
});
