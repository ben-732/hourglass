const mqtt = require("mqtt");

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

let hourglassStatus = {
  hourglass1: {
    connected: false,
    lastUpdated: null,
  },
  hourglass2: {
    connected: false,
    lastUpdated: null,
  },
};

const client = mqtt.connect("mqtt://localhost:1883");

const listenerHeader = "$SYS/brokers/emqx_main@172.20.0.2/";

let listeners = [
  "clients/hourglass1/connected",
  "clients/hourglass2/connected",
  "clients/hourglass2/disconnected",
  "clients/hourglass1/disconnected",
];

listeners = listeners.map((s) => listenerHeader + s);

client.on("connect", (e) => {
  console.log(`connected, ${client.options.clientId}`);

  // client.subscribe("device_connected");

  client.subscribe("disconnect");
  client.subscribe("ummm");
  // client.subscribe("$events/client_connected");

  for (let i of listeners) {
    client.subscribe(i);
  }

  client.publish("hourglass/change", "standard");
});

client.on("hourglass1/connected", () => {
  console.log("sss");
});

client.on("$events/client_connected", (message) => {
  console.log("client connected", message);
});

client.on("disconnect", () => {
  console.log("Disconnected");
});

client.on("close", () => {
  console.log("Closed");
});

client.on("message", (topic, message) => {
  // If the message is in the array of connect/disonnect messages, handle it
  if (listeners.includes(topic)) {
    handleConnectMessage(message, topic);
    return;
  }

  // Otherwise log the message to console
  console.log("received message %s %s", topic, message);
});

// Handle connect/disconnect messages
function handleConnectMessage(message, topic) {
  // First parse the message JSON
  const parsedMessage = JSON.parse(message.toString());

  const { clientid } = parsedMessage;

  // update hourglass status object
  hourglassStatus[parsedMessage.clientid].connected =
    topic.includes("connected");

  hourglassStatus[parsedMessage.clientid].lastUpdated = new Date();

  // Broadcast updated hourglass status to all connected clients
  io.emit("hourglassStatus", hourglassStatus);
}
