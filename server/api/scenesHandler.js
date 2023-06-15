const express = require("express");
const router = express.Router();
const getShow = require("../util/scenes");
const { io } = require("../services/io");

let show = getShow();

router.get("/", (req, res) => {
  const scenes = show.getScenes();
  res.json({ status: 200, message: "Success", scenes });
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
