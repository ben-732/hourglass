// Express Server
import express, { json, urlencoded } from "express";
import path from "path";
const app = express();
import cors from "cors";

import hourglassHandler from "./api/hourglassHandler.js";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static(path.join(__dirname, "./build")));

app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/hourglass/", hourglassHandler);

// 404 for api
app.use(function (req, res, next) {
  res.status(404).json({ status: 404, message: "not found" });
});

export default app;
