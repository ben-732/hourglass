// Socket IO connection and helper functions

const { Server } = require("socket.io");

let io;

function Socket(server = null) {
  // Check if there is a server instance
  if (!server && !io) throw new Error("[Socket] Server not initialized");
  if (io) return io;

  // Create a new socket.io instance
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

module.exports = Socket;
