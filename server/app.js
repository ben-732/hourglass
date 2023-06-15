// Express Server
const express = require("express");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/scenes/", require("./api/scenesHandler"));

// 404 for api
app.use(function (req, res, next) {
  res.status(404).json({ status: 404, message: "not found" });
});

module.exports = app;
