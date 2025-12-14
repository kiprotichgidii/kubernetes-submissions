const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let todos = [];
let nextId = 1;

app.get('/', (req, res) => {
    res.send('Todo Backend Online');
});

app.get('/todos', (req, res) => {
    res.json(todos);
});

app.post('/todos', (req, res) => {
    const { text } = req.body;
    if (!text || text.length > 140) {
        return res.status(400).json({ error: 'Invalid todo text' });
    }

    const newTodo = {
        id: nextId++,
        text,
        completed: false
    };
    todos.push(newTodo);
    console.log('Added todo:', newTodo);
    res.status(201).json(newTodo);
});

app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        res.json(todo);
    } else {
        res.status(404).json({ error: 'Todo not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Todo backend listening on port ${PORT}`);
});
