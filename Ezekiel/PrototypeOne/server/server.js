// Handles WebSocket connections and game logic

// Variables needed
// const noOfTeams = 2; // Example: 2 teams
// const teamSize = 3; // Example: 3 players per team
const clients = []; // Array to hold connected clients
const players = []; // Array to hold player Info

// let diceRolls = {}; // Object to hold dice rolls for each team
// let teamStatistics = {}; // Object to hold team statistics

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// logic here

// For handling WebSocket connections
wss.on('connection', (ws) => {
    // Handles Connection Messages
    ws.on('message', (msg) => {
        const data = JSON.parse(msg);

        if (data.type === 'login'){
            console.log(`${data.username} connected to game server`);
            clients.push({ws: ws, username: data.username, user_id: data.user_id, role: data.role});

            broadcastToAdmin('admin_login', data.username);
        }

        // Handles logout actions
        if (data.type === 'logout'){
            console.log(`${data.username} disconnected`);

            // removes client from database
            const index = clients.findIndex(clients => clients.username === data.username);

            if (index !== -1){
                clients.splice(index, 1);
            }

            broadcastToAdmin('admin_logout', data.username);
        }

        if (data.type === 'check_clients'){
            clients.forEach(({ws, ...client}) => {
                console.log(client);
            })
            // console.log(clients);
        }

        if (data.type === 'clear_clients'){
            clients = [];
        }

        if (data.type === "client_click"){
            broadcastToAdmin('admin_client_clicked', data.username);
        }
    })
})

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

server.listen(8080, () => {
  console.log('WebSocket server listening on port 8080');
});
