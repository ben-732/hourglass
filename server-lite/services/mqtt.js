// MQTT Server connection and helper functions

import { connect } from "mqtt";
import handleConnectMessage from "../util/hourglassStatus.js";

const host = process.env.mqttHost || "localhost";

const client = connect(`mqtt://${host}:1883`);

async function generateListeners() {
  // Get emqx node name from status api
  const res = await fetch(`http://${host}:18083/api/v5/status`);
  const text = await res.text();
  const nodeName = text.split(" ")[1];

  console.log(`[MQTT] Node name: ${nodeName}`);

  // Compare start of nodeName to "emqx@"
  if (!nodeName.startsWith("emqx@")) {
    throw new Error("Node name does not start with 'emqx@'");
  }

  let l = [
    "clients/Hourglass1/connected",
    "clients/Hourglass2/connected",
    "clients/Hourglass2/disconnected",
    "clients/Hourglass1/disconnected",
  ];

  return l.map((s) => `$SYS/brokers/${nodeName}/${s}`);
}

client.on("connect", async (e) => {
  console.log(`[MQTT] New Connection: `, client.options.clientId);

  const listeners = await generateListeners();

  // Subscribe to all connect/disconnect messages
  for (let i of listeners) {
    client.subscribe(i);
  }
});

client.on("message", (topic, message) => {
  // If the message is in the array of connect/disconnect messages, handle it
  if (listeners.includes(topic)) {
    handleConnectMessage(message, topic);
    return;
  }

  // Otherwise log the message to console
  console.log("[MQTT] Received message: %s %s", topic, message);
});

export default function getClient() {
  return client;
}
