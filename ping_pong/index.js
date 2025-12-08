const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const COUNT_FILE = process.env.COUNT_FILE || '/shared/count.log';

// Load existing count from the shared file (if present)
function readCount() {
  try {
    const data = fs.readFileSync(COUNT_FILE, 'utf8');
    const parsed = parseInt(data.trim(), 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  } catch (err) {
    return 0; // treat missing file or errors as zero
  }
}

// Persist the current count to the shared file
function writeCount(value) {
  const dir = path.dirname(COUNT_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(COUNT_FILE, String(value), 'utf8');
}

let counter = readCount();
console.log(`Pingpong starting with counter=${counter}, using ${COUNT_FILE}`);

app.get('/', (req, res) => {
  res.send(`pong ${counter}`);
  counter += 1;
  writeCount(counter);
});

app.listen(PORT, () => {
  console.log(`Pingpong app listening on port ${PORT}`);
});
