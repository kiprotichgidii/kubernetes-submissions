const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Generate a random UUID on startup
const randomString = crypto.randomUUID();

// Function to get the current timestamp
function getTimestamp() {
  return new Date().toISOString();
}

// --- HTTP endpoint to get current status ---
app.get('/status', (req, res) => {
  res.json({
    timestamp: getTimestamp(),
    randomString: randomString,
  });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
