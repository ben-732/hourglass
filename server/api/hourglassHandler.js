import { Router } from "express";
const router = Router();

import { getHourglassStatus } from "../util/hourglassStatus.js";

router.get("/status", (req, res) => {
  const status = getHourglassStatus();
  res.json({ status: 200, message: "Success", status });
});

export default router;
