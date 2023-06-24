import { Router } from "express";
const router = Router();

import { getHourglassStatus } from "../util/hourglassStatus.js";
import getClient from "../services/mqtt.js";

router.get("/status", (req, res) => {
  const status = getHourglassStatus();
  res.json({ status: 200, message: "Success", status });
});

router.post("/update", (req, res) => {
  const { state } = req.body;

  if (state.trim() == "") return res.status(400).json({ message: "No Update" });

  console.log(`[Hourglass] Change State "${state}"`);

  const client = getClient();

  client.publish("hourglass/change", state);

  res.status(200).json({ message: "success" });
});

export default router;
