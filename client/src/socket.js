import { io } from "socket.io-client";

// export const socket = io(process.env.serverThing || "http://localhost:3001");
export const socket = io("http://localhost:3000");
