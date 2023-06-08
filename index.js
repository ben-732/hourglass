const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://localhost:1883");

// client.on("connect", () => {
//   console.log("connected");
//   client.subscribe("device_connected");
//   client.subscribe("device_disconnected");
// });
