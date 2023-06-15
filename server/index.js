const mqtt = require("mqtt");

const { Server } = require("socket.io");

const io = new Server({
  /* options */
});

io.on("connection", (socket) => {
  console.log("connected");
});

io.listen(3001);

const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
  console.log(`connected, ${client.options.clientId}`);
  // client.subscribe("device_connected");

  client.subscribe("disconnect");
  client.subscribe("ummm");

  client.publish("hourglass/change", "standard");
});

client.on("disconnect", () => {
  console.log("Disconnected");
});

client.on("close", () => {
  console.log("Closed");
});

client.on("message", (topic, message) => {
  console.log("received message %s %s", topic, message);
});
