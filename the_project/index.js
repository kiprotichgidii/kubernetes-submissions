const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const https = require('https');

const CACHE_DIR = path.join(__dirname, 'cache'); // /app/cache
const IMAGE_PATH = path.join(CACHE_DIR, 'image.jpg');

// Ensure cache directory exists (though volume should be mounted here)
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Helper to handle redirects
function fetchImageWithRedirects(urlStr, resolve, reject) {
    https.get(urlStr, (response) => {
        // Handle redirects
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            console.log(`Redirecting to: ${response.headers.location}`);
            fetchImageWithRedirects(response.headers.location, resolve, reject);
            return;
        }

        if (response.statusCode !== 200) {
            reject(new Error(`Failed to fetch image: Status Code ${response.statusCode}`));
            return;
        }

        const file = fs.createWriteStream(IMAGE_PATH);
        response.pipe(file);
        file.on('finish', () => {
            file.close(() => resolve());
        });
    }).on('error', (err) => {
        fs.unlink(IMAGE_PATH, () => { });
        reject(err);
    });
}

async function fetchAndSaveImage() {
    return new Promise((resolve, reject) => {
        fetchImageWithRedirects('https://picsum.photos/800/400', resolve, reject);
    });
}


const port = Number(process.env.PORT) || 3000;

const htmlPage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ToDo App</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #ffffff;
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
            background: #312d36;
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
        }
        
        .static-list-container {
            background: #e8f0fe;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            color: #333;
            font-weight: 500;
        }

        .static-list-container ol {
            margin: 0;
            padding-left: 20px;
        }

        .static-list-container li {
            margin-bottom: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>✓ The Project App</h1>
        <div style="text-align: center; margin-bottom: 20px;">
           <img src="/image" alt="Random Picsum Image" style="border-radius: 10px; max-width: 100%; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        </div>
        <p class="subtitle">DevOps with Kubernetes 2025!</p>     
        <div class="input-container">
            <input type="text" id="todoInput" placeholder="Add a new task..." maxlength="140" />
            <button onclick="addTodo()">Add</button>
        </div>
        <div class="static-list-container">
            <ol>
                <li>Learn DevOps</li>
                <li>Learn Kubernetes</li>
                <li>Deploy to cluster</li>
            </ol>
        </div> 
        <ul class="todo-list" id="todoList">
            <li class="empty-state">No tasks yet. Add one above to get started!</li>
        </ul>
    </div>
    
    <script>
        let todos = [];
        
        async function fetchTodos() {
            try {
                const response = await fetch('/todos');
                if (response.ok) {
                    todos = await response.json();
                    renderTodos();
                } else {
                    console.error('Failed to fetch todos');
                }
            } catch (error) {
                console.error('Error fetching todos:', error);
            }
        }

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
                    </div>
                </li>
            \`).join('');
        }
        
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        async function addTodo() {
            const input = document.getElementById('todoInput');
            const text = input.value.trim();
            
            if (text === '') return;

            if (text.length > 140) {
                alert("Task cannot exceed 140 characters");
                return;
            }
            
            try {
                const response = await fetch('/todos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text })
                });

                if (response.ok) {
                    input.value = '';
                    fetchTodos();
                } else {
                    alert('Failed to add todo');
                }
            } catch (error) {
                console.error('Error adding todo:', error);
            }
        }
        
        async function toggleTodo(id) {
            try {
                const response = await fetch(\`/todos/\${id}\`, { method: 'PUT' });
                if (response.ok) {
                    fetchTodos();
                }
            } catch (error) {
                console.error('Error toggling todo:', error);
            }
        }
        
        document.getElementById('todoInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTodo();
            }
        });
        
        fetchTodos();
    </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (pathname === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlPage);
    } else if (pathname === '/image' && req.method === 'GET') {
        fs.stat(IMAGE_PATH, async (err, stats) => {
            if (err) {
                // File doesn't exist, fetch it and serve
                console.log('Image not found, fetching new one...');
                try {
                    await fetchAndSaveImage();
                    fs.createReadStream(IMAGE_PATH).pipe(res);
                } catch (e) {
                    console.error("Failed to fetch image", e);
                    res.writeHead(500);
                    res.end('Error fetching image');
                }
            } else {
                const now = new Date().getTime();
                const mtime = new Date(stats.mtime).getTime();
                const ageInMinutes = (now - mtime) / 1000 / 60;

                console.log(`Image age: ${ageInMinutes.toFixed(2)} minutes`);

                if (ageInMinutes > 10) {
                    console.log('Image is old. Serving current and updating in background.');
                    // Serve current (stale) image
                    fs.createReadStream(IMAGE_PATH).pipe(res);

                    // Update in background
                    fetchAndSaveImage().then(() => {
                        console.log('Background update complete.');
                    }).catch(e => console.error('Background update failed', e));

                } else {
                    console.log('Image is fresh.');
                    fs.createReadStream(IMAGE_PATH).pipe(res);
                }
            }
        });
    } else if (pathname === '/broken' && req.method === 'GET') {
        res.writeHead(500);
        res.end('Simulating crash...');
        setTimeout(() => {
            process.exit(1);
        }, 100);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Not Found</h1><p>The requested page does not exist.</p>');
    }
});

server.listen(port, () => {
    console.log(`Server started in port ${port}`);
});
