const http = require('http');

const port = process.env.PORT || 3000;
const message = process.env.MESSAGE || "Hello from Greeter!";

const server = http.createServer((req, res) => {
    console.log(`Received request from ${req.socket.remoteAddress}`);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(message);
});

server.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
