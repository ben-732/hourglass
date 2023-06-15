/**
 * Show Class - Represents a show
 */
class Show {
  /**
   * Construct a show out of an array of strings of names;
   *
   * @param {string[]} sceneNames Array of strings for scene names
   */

  scenes = [];
  activeScene = -1;

  constructor(sceneNames) {
    this.scenes = [];
    this.activeScene = -1;

    sceneNames.forEach((name, index) => {
      this.scenes.push(new Scene(name, index));
    });

    this.advance();
  }

  /**
   * Advance active scene
   *
   * @returns {Scene} The new active scene
   */
  advance() {
    if (this.activeScene < this.scenes.length - 1) {
      this.activeScene++;

      this.scenes[this.activeScene].time = new Date();

      return this.scenes[this.activeScene];
    }

    return null;
  }

  /**
   * Jump to a specific scene
   *
   * @param {number} sceneId The id of the scene to jump to
   * @returns {Scene | null} The new active scene or null if out of range
   */
  jumpToScene(sceneId) {
    // Return null if scene not in range
    if (!this.scenes[sceneId]) return null;

    this.activeScene = sceneId;

    scenes[this.activeScene].time = new Date();

    return scenes[this.activeScene];
  }

  /**
   * Get the current active scene
   * @returns {Scene | null} Scene -  The current active scene or null if not present
   */
  getActiveScene() {
    if (this.activeScene === -1) {
      return null;
    }

    return scenes[this.activeScene];
  }

  /**
   * Get all scenes in the show as a JSON object
   * @returns {Scene[]} JSON string of all scenes
   */
  getScenes() {
    return this.scenes;
  }

  /**
   * Reset the show to the beginning
   *
   */
  reset() {
    this.activeScene = 0;

    // Reset all scene times
    this.scenes.forEach((scene) => {
      scene.time = "";
    });

    // Set Preshow time
    this.scenes[0].time = new Date();
  }
}

/**
 * Scene Class - Represents a scene in the show
 */
class Scene {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.time = "";
  }
}

// List of scene names in the show
const sceneNames = [
  "Pre Show",
  "Prologue",
  "Act 1 Scene 1",
  "Act 1 Scene 2",
  "Act 1 Scene 3",
  "Act 1 Scene 4",
  "Act 1 Scene 5",
  "Act 1 Scene 6",
  "Act 1 Scene 7",
  "Act 1 Scene 8",
  "Act 1 Scene 9",
  "Act 1 Scene 10",
  "Act 1 Scene 11",
  "Act 1 Scene 12",
  "Act 1 Scene 13",
  "Intermission",
  "Act 2 Scene 1",
  "Act 2 Scene 2",
  "Act 2 Scene 3",
  "Act 2 Scene 4",
  "Act 2 Scene 5",
  "Act 2 Scene 6",
  "Act 2 Scene 7",
  "Act 2 Scene 8",
  "Act 2 Scene 9",
  "Epilogue",
];

// Show variable
let show;

// Function to return the show or make a new one

export default function getShow() {
  if (!show) show = new Show(sceneNames);

  return show;
}
