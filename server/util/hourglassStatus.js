import getIo from "../services/io.js";

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
  const io = getIo();
  // First parse the message JSON
  const parsedMessage = JSON.parse(message.toString());

  const clientId = parsedMessage.clientid;
  const isConnected = topic.includes("/connected");

  console.log(
    "[MQTT] Client: %s, Connection: %s",
    clientId,
    isConnected ? "Connected" : "Disconnected"
  );

  console.log(topic);

  // update hourglass status object
  hourglassStatus[clientId].connected = isConnected;

  hourglassStatus[clientId].lastUpdated = new Date();

  // Broadcast updated hourglass status to all connected clients
  io.emit("hourglassStatus", hourglassStatus);
}

export function getHourglassStatus() {
  return hourglassStatus;
}

export default handleConnectMessage;
