// MQTT Server connection and helper functions

import { connect } from "mqtt";
import handleConnectMessage from "../util/hourglassStatus.js";

const client = connect("mqtt://localhost:1883");

const listenerHeader = "$SYS/brokers/emqx_main@172.20.0.2/";

let listeners = [
  "clients/Hourglass1/connected",
  "clients/Hourglass2/connected",
  "clients/Hourglass2/disconnected",
  "clients/Hourglass1/disconnected",
];

// Construct listeners from listener header.
listeners = listeners.map((s) => listenerHeader + s);

client.on("connect", (e) => {
  console.log(`[MQTT] New Connection: `, client.options.clientId);

  // Subscribe to all connect/disconnect messages
  for (let i of listeners) {
    client.subscribe(i);
  }

  // client.publish("hourglass/change", "standard");
});

client.on("message", (topic, message) => {
  // If the message is in the array of connect/disonnect messages, handle it
  if (listeners.includes(topic)) {
    handleConnectMessage(message, topic);
    return;
  }

  // Otherwise log the message to console
  console.log("[MQTT] Received message: %s %s", topic, message);
});

export default client;
