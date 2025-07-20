const WebSocket = require('ws');
const mysql = require('mysql2');

const wss = new WebSocket.Server({ port: 8080 });

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test'
});

const clients = {
  admin: [],
  user: []
};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);

    if (data.role === 'admin') {
      clients.admin.push(ws);
    } else if (data.role === 'user') {
      clients.user.push(ws);
    }

    if (data.action && data.user) {
      // Save to database
      db.query(
        'INSERT INTO actions (user, action) VALUES (?, ?)',
        [data.user, data.action],
        (err) => {
          if (err) console.error(err);
        }
      );

      // Broadcast to admins
      clients.admin.forEach(admin => {
        if (admin.readyState === WebSocket.OPEN) {
          admin.send(JSON.stringify({
            user: data.user,
            action: data.action,
            timestamp: new Date().toISOString()
          }));
        }
      });
    }
  });

  ws.on('close', () => {
    clients.admin = clients.admin.filter(c => c !== ws);
    clients.user = clients.user.filter(c => c !== ws);
  });
});

console.log("✅ WebSocket server running on ws://localhost:8080");