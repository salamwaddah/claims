const serverless = require("serverless-http");
const express = require("express");
const app = express();

app.get("/claim", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from claims!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
