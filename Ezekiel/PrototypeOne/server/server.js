// Handles WebSocket connections and game logic

// Variables needed
// const noOfTeams = 2; // Example: 2 teams
// const teamSize = 3; // Example: 3 players per team
// const clients = []; // Array to hold connected clients

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
        }

        // Handles logout actions
        if (data.type === 'logout'){
            console.log(`${data.username} disconnected`);
        }
    })
})

server.listen(8080, () => {
  console.log('WebSocket server listening on port 8080');
});
