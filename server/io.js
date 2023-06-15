const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Socket Connection: " + socket.id);
});

io.listen(3001);

module.exports.io = io;
