const express = require("express");
const router = express.Router();
const { startShow } = require("../util/scenes");
const { io } = require("../services/io");

const show = startShow();

router.get("/", (req, res) => {
  const scenes = show.getScenes();
  res.json({
    status: 200,
    message: "Success",
    scenes,
    activeScene: show.activeScene,
  });
});

router.post("/advance", (req, res) => {
  const scene = show.advance();
  res.json({ status: 200, message: "Success" });

  io.emit("updateScene", scene);
  io.emit("activeCue", scene.id);
});

router.post("/reset", (req, res) => {
  const scene = show.reset();

  res.json({ status: 200, message: "pain" });

  io.emit("resetShow");
});

module.exports = router;
