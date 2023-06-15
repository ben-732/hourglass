const { app } = require("./app");
const Socket = require("./services/io");
const { client } = require("./services/mqtt");

const http = require("http");

const server = http.createServer(app);

const io = Socket(server);

server.listen(3001, () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Server listening on port " + bind);
});
