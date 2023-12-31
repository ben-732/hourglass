import { InitSocket } from "./services/io.js";

import app from "./app.js";

import { createServer } from "http";

const server = createServer(app);

const io = InitSocket(server);

server.listen(process.env.PORT || 3001, () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("[HTTP] Server listening on port " + bind);
});
