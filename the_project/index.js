const http = require('http');
const url = require('url');

const port = Number(process.env.PORT) || 3000;

const htmlPage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>To-Do App</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            width: 100%;
            max-width: 500px;
            padding: 30px;
        }
        
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 2rem;
        }
        
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 0.9rem;
        }
        
        .input-container {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        input[type="text"] {
            flex: 1;
            padding: 12px 15px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.3s;
        }
        
        input[type="text"]:focus {
            border-color: #667eea;
        }
        
        button {
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        button:active {
            transform: translateY(0);
        }
        
        .todo-list {
            list-style: none;
        }
        
        .todo-item {
            background: #f5f5f5;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            animation: fadeIn 0.3s;
            transition: background 0.3s;
        }
        
        .todo-item:hover {
            background: #eeeeee;
        }
        
        .todo-item.completed {
            opacity: 0.6;
            text-decoration: line-through;
        }
        
        .todo-text {
            flex: 1;
            color: #333;
            font-size: 1rem;
        }
        
        .todo-actions {
            display: flex;
            gap: 10px;
        }
        
        .btn-small {
            padding: 6px 12px;
            font-size: 0.85rem;
            border-radius: 5px;
        }
        
        .btn-complete {
            background: #4caf50;
        }
        
        .btn-delete {
            background: #f44336;
        }
        
        .empty-state {
            text-align: center;
            color: #999;
            padding: 40px 20px;
            font-style: italic;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>✓ To-Do App</h1>
        <p class="subtitle">Stay organized and get things done!</p>
        
        <div class="input-container">
            <input type="text" id="todoInput" placeholder="Add a new task..." />
            <button onclick="addTodo()">Add</button>
        </div>
        
        <ul class="todo-list" id="todoList">
            <li class="empty-state">No tasks yet. Add one above to get started!</li>
        </ul>
    </div>
    
    <script>
        let todos = JSON.parse(localStorage.getItem('todos')) || [];
        let nextId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
        
        function renderTodos() {
            const todoList = document.getElementById('todoList');
            
            if (todos.length === 0) {
                todoList.innerHTML = '<li class="empty-state">No tasks yet. Add one above to get started!</li>';
                return;
            }
            
            todoList.innerHTML = todos.map(todo => \`
                <li class="todo-item \${todo.completed ? 'completed' : ''}">
                    <span class="todo-text">\${escapeHtml(todo.text)}</span>
                    <div class="todo-actions">
                        <button class="btn-small btn-complete" onclick="toggleTodo(\${todo.id})">
                            \${todo.completed ? 'Undo' : 'Complete'}
                        </button>
                        <button class="btn-small btn-delete" onclick="deleteTodo(\${todo.id})">Delete</button>
                    </div>
                </li>
            \`).join('');
        }
        
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        function addTodo() {
            const input = document.getElementById('todoInput');
            const text = input.value.trim();
            
            if (text === '') {
                return;
            }
            
            todos.push({
                id: nextId++,
                text: text,
                completed: false
            });
            
            input.value = '';
            saveTodos();
            renderTodos();
        }
        
        function toggleTodo(id) {
            const todo = todos.find(t => t.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                saveTodos();
                renderTodos();
            }
        }
        
        function deleteTodo(id) {
            todos = todos.filter(t => t.id !== id);
            saveTodos();
            renderTodos();
        }
        
        function saveTodos() {
            localStorage.setItem('todos', JSON.stringify(todos));
        }
        
        document.getElementById('todoInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTodo();
            }
        });
        
        renderTodos();
    </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
	const parsedUrl = url.parse(req.url, true);
	const pathname = parsedUrl.pathname;
	
	if (pathname === '/' && req.method === 'GET') {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(htmlPage);
	} else {
		res.writeHead(404, { 'Content-Type': 'text/html' });
		res.end('<h1>404 - Not Found</h1><p>The requested page does not exist.</p>');
	}
});

server.listen(port, () => {
	console.log(`Server started in port ${port}`);
});
