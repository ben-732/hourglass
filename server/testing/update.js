// A Script to manually update the state of hourglass from the command line
// Used for testing purposes

import { connect } from "mqtt";

const client = connect("mqtt://localhost:1883");

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
