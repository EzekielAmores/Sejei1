const http = require('http');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
  if (req.url === '/status') {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200);
    res.end('OK');
  }
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.send('Hello from Node.js WebSocket!');
});

server.listen(3000, () => {
  console.log('Node.js server running on http://localhost:3000');
});