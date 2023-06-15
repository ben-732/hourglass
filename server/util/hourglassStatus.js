const { io } = require("../services/io");

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

// Handle connect/disconnect messages from MQTT
function handleConnectMessage(message, topic) {
  // First parse the message JSON
  const parsedMessage = JSON.parse(message.toString());

  const { clientid } = parsedMessage;

  console.log(
    "Client: %s, Connection: %s",
    clientid,
    topic.includes("/connected")
  );

  console.log(topic);

  // update hourglass status object
  hourglassStatus[clientid].connected = topic.includes("/connected");

  hourglassStatus[clientid].lastUpdated = new Date();

  // Broadcast updated hourglass status to all connected clients
  io.emit("hourglassStatus", hourglassStatus);
}

module.exports = handleConnectMessage;
