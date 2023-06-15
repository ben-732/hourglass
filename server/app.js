// Express Server
import express, { json, urlencoded } from "express";
const app = express();
import cors from "cors";

import scenesHandler from "./api/scenesHandler.js";
import hourglassHandler from "./api/hourglassHandler.js";

app.use(
  cors({
    origin: "*",
  })
);

app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/scenes/", scenesHandler);
app.use("/api/hourglass/", hourglassHandler);

// 404 for api
app.use(function (req, res, next) {
  res.status(404).json({ status: 404, message: "not found" });
});

export default app;
