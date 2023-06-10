const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://localhost:1883");

if (!process.argv) end();
const thing = process.argv[2].toLowerCase();

client.on("connect", () => {
  console.log(`connected, ${client.options.clientId}`);
  client.publish("hourglass/change", thing);
  console.log(`Set Preset ${thing}`);
  setTimeout(end, 1000);
});

function end() {
  process.exit();
}
