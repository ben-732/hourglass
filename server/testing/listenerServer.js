// Basic server for testing connections to the MQTT broker

const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://localhost:1883", {
  clientId: "hourglass1",
});

client.on("connect", () => {
  console.log(`connected, ${client.options.clientId}`);
});
