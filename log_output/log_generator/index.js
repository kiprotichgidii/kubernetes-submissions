const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Shared file path (must match the reader container)
const STATUS_FILE = process.env.STATUS_FILE || '/shared/status.log';

// Ensure directory exists (for robustness if path ever changes)
const dir = path.dirname(STATUS_FILE);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Generate a random UUID on startup (one per pod restart)
const randomString = crypto.randomUUID();

function getTimestamp() {
  return new Date().toISOString();
}

function writeLine() {
  const line = `${getTimestamp()}: ${randomString}.\n`;
  fs.appendFile(STATUS_FILE, line, (err) => {
    if (err) {
      console.error('Error writing status line:', err);
    } else {
      console.log('Wrote line:', line.trim());
    }
  });
}

console.log('Generator starting. Using file:', STATUS_FILE);

// Write immediately once on startup, then every 5 seconds
writeLine();
setInterval(writeLine, 5000);
