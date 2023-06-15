// Basic server for testing connections to the MQTT broker

import { connect } from "mqtt";

const client = connect("mqtt://localhost:1883", {
  clientId: "hourglass1",
});

client.on("connect", () => {
  console.log(`connected, ${client.options.clientId}`);
});
