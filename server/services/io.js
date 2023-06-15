// Socket IO connection and helper functions

const { Server } = require("socket.io");

let io;

function Socket(server) {
  // Create a new socket.io instance form given server
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", (socket) => {
    console.log("[Socket] New Connection: " + socket.id);
  });

  return io;
}

module.exports = { io, Socket };
