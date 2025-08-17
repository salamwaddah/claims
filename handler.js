const serverless = require("serverless-http");
const express = require("express");

const app = express();
app.use(express.json());

app.post("/claims", async (req, res) => {
  try {
    const { symptoms, medicines } = req.body || {};

    if (!symptoms || !medicines) {
      return res.status(400).json({ error: "symptoms and medicines are required" });
    }

    const prompt = `Write a concise authorization justification letter in professional insurance language. Symptoms: ${symptoms} Prescribed medicines: ${medicines}`;

    return res.status(200).json({ message: prompt });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
