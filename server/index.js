import { InitSocket } from "./services/io.js";
import client from "./services/mqtt.js";

import app from "./app.js";

import { Server, Client } from "node-osc";

import { createServer } from "http";

import StartMidi from "./services/msc.js";

const server = createServer(app);

const io = InitSocket(server);

StartMidi();

// var oscServer = new Server(53000, "10.0.56.205", () => {
//   console.log("[OSC] Server is listening: localhost:53000 xx");
// });

// oscServer.on("message", function (message) {
//   if (message[0].includes("led")) return;

//   const command = message.shift();

//   console.log(
//     `[OSC] [${new Date().toLocaleTimeString()}] Message: ${command} : ${message}`
//   );
//   // oscServer.close();
// });

server.listen(3001, () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("[HTTP] Server listening on port " + bind);
});
