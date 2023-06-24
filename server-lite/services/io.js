// Socket IO connection and helper functions

import { Server } from "socket.io";

let io;

export function InitSocket(server) {
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

function getIo() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
}

export default getIo;
