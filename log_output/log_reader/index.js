const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Shared file paths (must match the generator container and ping-pong)
const STATUS_FILE = process.env.STATUS_FILE || '/shared/status.log';
const COUNT_FILE = process.env.COUNT_FILE || '/shared/pingpong.count';

function readLatestStatusLine() {
  try {
    const data = fs.readFileSync(STATUS_FILE, 'utf8').trim();
    if (!data) return null;
    const lines = data.split('\n').filter(Boolean);
    return lines[lines.length - 1];
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    console.error('Error reading status file:', err);
    throw err;
  }
}

function readCount() {
  try {
    const data = fs.readFileSync(COUNT_FILE, 'utf8').trim();
    const parsed = parseInt(data, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  } catch (err) {
    if (err.code === 'ENOENT') return 0; // treat missing as zero
    console.error('Error reading count file:', err);
    throw err;
  }
}

// --- HTTP endpoint to get current status + ping/pong count ---
app.get('/status', (req, res) => {
  try {
    const latestStatus = readLatestStatusLine();
    const count = readCount();

    if (!latestStatus) {
      return res
        .status(200)
        .type('text/plain')
        .send('No data written yet.\n');
    }

    const response = `${latestStatus}\n\nPing / Pongs: ${count}\n`;
    res.type('text/plain').send(response);
  } catch (err) {
    return res.status(500).send('Error reading status.\n');
  }
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(
    `Reader started on port ${PORT}, serving file: ${STATUS_FILE}, counting from: ${COUNT_FILE}`
  );
});
