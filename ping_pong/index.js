const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

let counter = 0;
console.log(`Pingpong starting with counter=${counter}`);

app.get('/', (req, res) => {
  counter += 1;
  res.send(`pong ${counter}`);
});

app.get('/pings', (req, res) => {
  res.send(String(counter));
});

app.listen(PORT, () => {
  console.log(`Pingpong app listening on port ${PORT}`);
});
