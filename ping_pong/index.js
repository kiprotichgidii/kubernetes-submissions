const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT || 5432,
});

const connectToDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pings (
        id SERIAL PRIMARY KEY,
        count INTEGER NOT NULL
      );
    `);

    // Initialize count if not exists
    const res = await pool.query('SELECT count FROM pings WHERE id = 1');
    if (res.rowCount === 0) {
      await pool.query('INSERT INTO pings (id, count) VALUES (1, 0)');
    }

    console.log('Connected to database and table ensured');
  } catch (err) {
    console.error('Error connecting to database', err);
    // Retry connection logic could be added here, simplified for now
    setTimeout(connectToDb, 5000);
  }
};

connectToDb();

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('UPDATE pings SET count = count + 1 WHERE id = 1 RETURNING count');
    const count = result.rows[0].count;
    res.send(`pong ${count}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

app.get('/pings', async (req, res) => {
  try {
    const result = await pool.query('SELECT count FROM pings WHERE id = 1');
    const count = result.rows[0] ? result.rows[0].count : 0;
    res.send(String(count));
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

app.listen(PORT, () => {
  console.log(`Pingpong app listening on port ${PORT}`);
});
