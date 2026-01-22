const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
        CREATE TABLE IF NOT EXISTS todos (
          id Serial PRIMARY KEY,
          text VARCHAR(140) NOT NULL,
          completed BOOLEAN DEFAULT FALSE
        );
      `);
        console.log('Connected to database and table ensured');
    } catch (err) {
        console.error('Error connecting to database', err);
        setTimeout(connectToDb, 5000);
    }
};

connectToDb();

app.get('/', (req, res) => {
    res.send('Todo Backend Online');
});

app.get('/healthz', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).send('ok');
    } catch (err) {
        console.error('Health check failed', err);
        res.status(500).send('error');
    }
});

app.get('/todos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM todos ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/todos', async (req, res) => {
    const { text } = req.body;

    console.log(`Received todo request: ${text}`);

    if (!text || text.length > 140) {
        console.warn(`Todo validation failed. Length: ${text ? text.length : 0}. Text: ${text}`);
        return res.status(400).json({ error: 'Invalid todo text' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO todos (text, completed) VALUES ($1, $2) RETURNING *',
            [text, false]
        );
        const newTodo = result.rows[0];
        console.log('Added todo:', newTodo);
        res.status(201).json(newTodo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/todos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query(
            'UPDATE todos SET completed = NOT completed WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Todo not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(PORT, () => {
    console.log(`Todo backend listening on port ${PORT}`);
});
