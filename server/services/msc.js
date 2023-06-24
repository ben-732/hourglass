import msc from "midi-show-control";
import midi from "midi";
import getIo from "./io.js";
import getShow from "../util/scenes.js";

let cueLists = {
  act1: "0",
  act2: "0",
};

const cueMappings = [
  { showId: 0, cueNumber: 0 }, // Before
  { showId: 1, cueNumber: 2 }, // Prolouge
  { showId: 2, cueNumber: 3 }, // s1
  { showId: 3, cueNumber: 14 },
  { showId: 4, cueNumber: 22 },
  { showId: 5, cueNumber: 24 },
  { showId: 6, cueNumber: 31 },
  { showId: 7, cueNumber: 34 },
  { showId: 8, cueNumber: 38 },
  { showId: 9, cueNumber: 40 },
  { showId: 10, cueNumber: 42 },
  { showId: 11, cueNumber: 44 },
  { showId: 12, cueNumber: 45 },
  { showId: 13, cueNumber: 47 },
  { showId: 14, cueNumber: 50 },
  { showId: 15, cueNumber: 56 }, // Intermission
].reverse();

const cueMappings2 = [
  { showId: 15, cueNumber: 0 }, // Intermission
  { showId: 16, cueNumber: 2 }, // S1
  { showId: 17, cueNumber: 5 }, // S2
  { showId: 18, cueNumber: 7 }, // s3 Confirm
  { showId: 19, cueNumber: 19 }, // s4 Confirm
  { showId: 20, cueNumber: 34 }, //s5
  { showId: 21, cueNumber: 38 },
  { showId: 22, cueNumber: 47 },
  { showId: 23, cueNumber: 49 }, /// Cofirm
  { showId: 24, cueNumber: 53 }, ///Condifm
  { showId: 24, cueNumber: 56 }, ///End of show --configm
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

      // console.log(controlMessage);
    } catch (e) {
      console.log(e);
      console.log("[Midi] MSC Parse Fail");
      return;
    }
  });
}

function handleCueChange() {
  const { act1, act2 } = cueLists;
  const show = getShow();

  // If the show is "reset"
  if (act1 == "0" && act2 == "0") {
    // No active scene, Do nothing
    return;
  }

  if (act2 === "0") {
    const scene = cueMappings.find((x) => parseInt(act1) >= x.cueNumber);

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
    const scene = cueMappings2.find((x) => parseInt(act2) >= x.cueNumber);

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
  }
}

export default StartMidi;
