const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

let players = [];
let adminSocket = null;
let gameStarted = false;

io.on('connection', socket => {
  console.log("New connection");

  socket.on("join_player", data => {
    players.push({ socketId: socket.id, ...data });
    console.log(`Player joined: ${data.username}`);

    if (adminSocket) adminSocket.emit("update_players", players);

    socket.emit("message", "Waiting for game to start...");
  });

  socket.on("join_admin", data => {
    adminSocket = socket;
    console.log("Admin connected");
    adminSocket.emit("update_players", players);
    if (players.length >= 2 && !gameStarted) {
      adminSocket.emit("enable_start");
    }
  });

  socket.on("start_game", () => {
    gameStarted = true;
    io.emit("game_started");
    console.log("Game started by admin");
  });

  socket.on("player_click", data => {
    if (adminSocket) {
      adminSocket.emit("message", `${data.username} clicked the button!`);
    }
  });

  socket.on("disconnect", () => {
    players = players.filter(p => p.socketId !== socket.id);
    if (adminSocket) adminSocket.emit("update_players", players);
  });
});

server.listen(3000, () => {
  console.log("Socket.IO server running on http://localhost:3000");
});
