const express = require('express');
const fs = require('fs');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

// Shared file paths (must match the generator container)
const STATUS_FILE = process.env.STATUS_FILE || '/shared/status.log';
const PING_PONG_URL = process.env.PING_PONG_URL || 'http://ping-pong-svc:80/pings';

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

function getPongs() {
  return new Promise((resolve) => {
    http.get(PING_PONG_URL, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve(data.trim());
      });
    }).on('error', (err) => {
      console.error('Error fetching pongs:', err.message);
      resolve(null);
    });
  });
}

// --- HTTP endpoint to get current status + ping/pong count ---
const CONFIG_FILE_PATH = process.env.CONFIG_FILE_PATH || '/etc/config/information.txt';
const MESSAGE = process.env.MESSAGE || 'default message';

app.get('/', async (req, res) => {
  try {
    const latestStatus = readLatestStatusLine();
    const count = await getPongs();

    // Read config file content
    let fileContent = '';
    try {
      fileContent = fs.readFileSync(CONFIG_FILE_PATH, 'utf8').trim();
    } catch (err) {
      console.error('Error reading config file:', err.message);
      fileContent = 'Error reading file';
    }

    if (!latestStatus) {
      return res
        .status(200)
        .type('text/plain')
        .send('No data written yet.\n');
    }

    const response = `file content: ${fileContent}\nenv variable: MESSAGE=${MESSAGE}\n${latestStatus}\n\nPing / Pongs: ${count}\n`;
    res.type('text/plain').send(response);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error reading status.\n');
  }
});


app.get('/healthz', async (req, res) => {
  try {
    const result = await getPongs();
    if (result === null) {
      return res.status(500).send('error');
    }
    res.status(200).send('ok');
  } catch (err) {
    res.status(500).send('error');
  }
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(
    `Reader started on port ${PORT}, serving file: ${STATUS_FILE}, fetching pongs from: ${PING_PONG_URL}`
  );
});
