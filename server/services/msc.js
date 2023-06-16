import msc from "midi-show-control";
import midi from "midi";
import getIo from "./io.js";
import getShow from "../util/scenes.js";

let cueLists = {
  act1: "0",
  act2: "0",
};

const cueMappings = [
  { showId: 0, cueNumber: 0 },
  { showId: 1, cueNumber: 2 },
  { showId: 2, cueNumber: 3 },
  { showId: 3, cueNumber: 14 },
].reverse();

function StartMidi() {
  // Set up a new input.
  let input = new midi.Input();

  // Get the name of a specified input port.
  const thing = input.getPortName(0);

  input.openPort(0);
  input.ignoreTypes(false, false, false);

  console.log("[MIDI] Connecting to port 0 (%s)", thing);

  // Configure a callback.
  input.on("message", (deltaTime, message) => {
    try {
      const controlMessage = msc.parseMessage(message);
      if (controlMessage.command == "set") return;

      if (
        controlMessage.command === "go" ||
        controlMessage.command === "goOff"
      ) {
        const io = getIo();

        const { cue, cueList } = controlMessage;
        // Get list from message
        let list = "";
        if (cueList === "180") list = "act1";
        else if (cueList === "181") list = "act2";

        // If no list matched, return
        if (!list) return;

        // Update list
        cueLists[list] = cue;

        console.log("[MIDI] %s: Cue %s", list, cue);

        handleCueChange();
        return;
      }

      if (controlMessage.command == "allOff") {
        cueLists = {
          act1: "0",
          act2: "0",
        };

        handleCueChange();

        return;
      }

      console.log(controlMessage);
    } catch (e) {
      console.log(e);
      console.log("[Midi] MSC Parse Fail");
      return;
    }

    // The message is an array of numbers corresponding to the MIDI bytes:
    //   [status, data1, data2]
    // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
    // information interpreting the messages.
    // console.log(`[MIDI] Message: ${message} d: ${deltaTime}`);
  });
}

function handleCueChange() {
  const { act1, act2 } = cueLists;
  const show = getShow();

  // If the show is "reset"
  if (act1 == "0" && act2 == "0") {
    const io = getIo();
    console.log("[MIDI] Resetting...");
    show.reset();
    io.emit("resetShow");
    return;
  }

  if (act2 === "0") {
    console.log("Here", act1);

    console.log(cueMappings);
    console.log(`${parseInt(act1)} >= ${"ss"}`);

    const scene = cueMappings.find((x) => parseInt(act1) >= x.cueNumber);

    console.log(scene);

    if (!scene) {
      console.log("[MIDI] Scene map problems...");
      return;
    }

    if (show.activeScene != scene.showId) {
      const io = getIo();
      const updatedScene = show.jumpToScene(scene.showId);

      io.emit("updateScene", updatedScene);
      io.emit("activeScene", updatedScene.id);
    }
    // Do act 1 stuff
  } else {
    // Do act 2 stuff
  }
}

export default StartMidi;
