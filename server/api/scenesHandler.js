import { Router } from "express";
const router = Router();
import getShow from "../util/scenes.js";
import getIo from "../services/io.js";

router.get("/", (req, res) => {
  const show = getShow();

  const scenes = show.getScenes();
  res.json({
    status: 200,
    message: "Success",
    scenes,
    activeScene: show.activeScene,
  });
});

router.post("/advance", (req, res) => {
  const io = getIo();
  const show = getShow();

  const scene = show.advance();
  res.json({ status: 200, message: "Success" });

  io.emit("updateScene", scene);
  io.emit("activeScene", scene.id);
});

router.post("/reset", (req, res) => {
  const scene = show.reset();

  res.json({ status: 200, message: "pain" });

  io.emit("resetShow");
});

export default router;
