const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = []; // { ws, username, role, team_id, ready }

const REQUIRED_USERS = 4;

async function authSession(cookieStr) {
  if (!cookieStr) return null;
  try {
    const res = await axios.get('http://localhost/gelrose/public/session_check.php', {
      headers: { Cookie: cookieStr }
    });

    if (!res.data || !res.data.username || !res.data.role) {
      console.log('Session check failed:', res.data);
      return null;
    }

    return res.data; // should return: { username, role, team_id? }
  } catch (err) {
    console.error('Session check error:', err.message);
    return null;
  }
}

wss.on('connection', async (ws, req) => {
  const cookie = req.headers.cookie;
  const session = await authSession(cookie);

  console.log('New connection: session =', session);

  if (!session) {
    ws.close();
    return;
  }

//   if (!session || !session.team_id) {
//     ws.close();
//     return;
//   }

  // Attach session to socket
  ws.session = session;

  // Add to connected clients
  clients.push({
    ws,
    username: session.username,
    role: session.role,
    team_id: session.team_id || null,
    position: session.position || null,
    ready: false,
  });

  // Send ready count to admin
  broadcastToAdmin('ready_count', {
    count: clients.filter(c => c.role === 'user' && c.ready).length
  });

  ws.on('message', msg => {
    try {
      const data = JSON.parse(msg);
      handleMessage(ws, data);
    } catch (err) {
      console.error('Invalid message:', msg);
    }
  });

  ws.on('close', () => {
    clients = clients.filter(c => c.ws !== ws);
    broadcastToAdmin('ready_count', {
      count: clients.filter(c => c.role === 'user' && c.ready).length
    });
  });
});

async function handleMessage(ws, data) {
  console.log('Received message:', data);
  const sender = clients.find(c => c.ws === ws);
  if (!sender) return;

  if (data.type === 'ready') {
    sender.ready = true;
    // broadcastToAdmin('ready_count', {
    //   count: clients.filter(c => c.role === 'user' && c.ready).length
    // });

    const readyUsers = clients.filter(c => c.role === 'user' && c.ready);
    broadcastToAdmin('ready_count', { count: readyUsers.length });

    // 🔽 If all users are ready, trigger the game start
    if (readyUsers.length === REQUIRED_USERS) {
        startGame();
    }
  }

  if (data.type === 'click' && sender.position === 1) {
    console.log(`[CLICK] ${sender.username} from team ${sender.team_id} clicked.`);
    console.log("UY ni click ko")

    if (!sender.team_id) {
      console.warn('No team_id found for user:', sender.username);
      return;
    }

    // broadcastToAdmin('clicked', { user: sender.username });

    broadcastToAdmin('player_clicked', {
      user: sender.username,
      team_id: sender.team_id
    });

    // try {
    //   await axios.post('http://localhost/gelrose/public/api/swap_position.php', {
    //     team_id: sender.team_id
    //   });

    //   // Fetch updated team info
    //   const res = await axios.get('http://localhost/gelrose/public/api/get_teams.php');
    //   broadcastToAll('teams_update', res.data);

    // } catch (err) {
    //   console.error('Swap position failed:', err.message);
    // }

    try {
        console.log('Server.js:140 Sending swap request for team_id:', sender.team_id);

        const res = await axios.post('http://localhost/gelrose/public/api/swap_position.php', {
        team_id: sender.team_id
        });

        console.log('Server.js:146 Sent swap request for team_id:', sender.team_id);

        if (res.data.success) {
            console.log('Server.js:149 success');
        // Notify all clients and admin of the update
        // You might also want to fetch new team state and send it
        io.emit('position_updated', {
            team_id: sender.team_id,
            message: `Team ${sender.team_id} rotated turns`
        });
        }
    } catch (err) {
        console.error('Swap failed:', err.message);
    }
  }
}

function broadcastToAdmin(type, data) {
  const msg = JSON.stringify({ type, data });
  clients
    .filter(c => c.role === 'admin')
    .forEach(c => {
      if (c.ws.readyState === WebSocket.OPEN) {
        c.ws.send(msg);
      }
    });
}

function broadcastToAll(type, data) {
  const msg = JSON.stringify({ type, data });
  clients.forEach(c => {
    if (c.ws.readyState === WebSocket.OPEN) {
      c.ws.send(msg);
    }
  });
}

function startGame() {
    broadcastToAdmin('game_start', { message: 'Game is starting!' });
  // Group users by team

  const users = clients.filter(c => c.role === 'user');
  const teams = {};

  for (const user of users) {
    if (!teams[user.team_id]) {
      teams[user.team_id] = [];
    }
    teams[user.team_id].push(user);
  }

  // For each team, find the first player and send them an enable button message
  for (const team of Object.values(teams)) {
    const firstPlayer = team[0]; // assuming array order reflects position
    if (firstPlayer && firstPlayer.ws.readyState === WebSocket.OPEN) {
      firstPlayer.ws.send(JSON.stringify({
        type: 'button_enabled',
        data: { message: 'Your turn! Click the button.' }
      }));
    }
  }

//   clients.filter(c => c.role === 'user').forEach(user => {
//     if (!teams[user.team_id]) teams[user.team_id] = [];
//     teams[user.team_id].push(user);
//   });

//   // For each team, give the first member the button privilege
//   Object.values(teams).forEach(teamMembers => {
//     if (teamMembers.length > 0) {
//       const firstPlayer = teamMembers[0];
//       firstPlayer.ws.send(JSON.stringify({
//         type: 'button_enabled',
//         data: { message: 'You go first!' }
//       }));
//     }
//   });

  // Notify admin that game started
  broadcastToAdmin('game_start', { message: 'All players ready. Game started!' });
}

server.listen(8080, () => {
  console.log('WebSocket server listening on port 8080');
});
