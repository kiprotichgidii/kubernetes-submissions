const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory counter, will reset when the pod is restarted
let counter = 0;

app.get('/', (req, res) => {
  res.send(`pong ${counter}`);
  counter += 1;
});

app.listen(PORT, () => {
  console.log(`Pingpong app listening on port ${PORT}`);
});


