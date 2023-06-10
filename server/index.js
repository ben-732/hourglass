const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://localhost:1883");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

client.on("connect", () => {
  console.log(`connected, ${client.options.clientId}`);
  // client.subscribe("device_connected");

  client.subscribe("$events/client_disconnected");
  client.subscribe("$events/client_connected");
});

client.on("message", (topic, message) => {
  console.log("received message %s %s", topic, message);
});
