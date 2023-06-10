const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://localhost:1883");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

client.on("connect", () => {
  console.log(`connected, ${client.options.clientId}`);
  // client.subscribe("device_connected");

  client.subscribe("disconnect");
  client.subscribe("ummm");

  setInterval(() => {
    client.publish("hourglass/change", "hello");
  }, 3000);
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