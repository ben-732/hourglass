import { InitSocket } from "./services/io.js";
import client from "./services/mqtt.js";

import app from "./app.js";

import { Server, Client } from "node-osc";

import { createServer } from "http";

import StartMidi from "./services/msc.js";

const server = createServer(app);

const io = InitSocket(server);

StartMidi();

server.listen(process.env.PORT || 3001, () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("[HTTP] Server listening on port " + bind);
});
