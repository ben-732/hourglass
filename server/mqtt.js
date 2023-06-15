const mqtt = require("mqtt");
const handleConnectMessage = require("./util/hourglassStatus");

const client = mqtt.connect("mqtt://localhost:1883");

const listenerHeader = "$SYS/brokers/emqx_main@172.20.0.2/";

let listeners = [
  "clients/hourglass1/connected",
  "clients/hourglass2/connected",
  "clients/hourglass2/disconnected",
  "clients/hourglass1/disconnected",
];

// Construct listeners from listener header.
listeners = listeners.map((s) => listenerHeader + s);

client.on("connect", (e) => {
  console.log(`MQTT Connected: , ${client.options.clientId}`);

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
  console.log("received message %s %s", topic, message);
});
