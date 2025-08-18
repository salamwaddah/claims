const serverless = require("serverless-http");
const express = require("express");
const AWS = require("aws-sdk");

const app = express();
app.use(express.json());

const lambda = new AWS.Lambda();

app.post("/claims", async (req, res) => {
  try {
    const { symptoms, medicines } = req.body || {};

    if (!symptoms || !medicines) {
      return res.status(400).json({ error: "symptoms and medicines are required" });
    }

    const prompt = `Write a concise authorization justification letter in professional insurance language. Symptoms: ${symptoms} Prescribed medicines: ${medicines}`;

    const params = {
        FunctionName: "Claims-dev-model",
        InvocationType: "RequestResponse",
        Payload: JSON.stringify({ prompt }),
    };

    const response = await lambda.invoke(params).promise();
    const result = JSON.parse(response.Payload);

    return res.status(200).json({ message: result.message });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// dummy endpoint until I figure out the model.
app.post("/model", async (req, res) => {
    const { prompt } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: "prompt is required" });
    }

    return res.status(200).json({ message: `received prompt: ${prompt}` });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
