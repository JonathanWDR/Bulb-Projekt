import express from "express";
import cors from "cors";
import { sendCommand } from "../../shared/rabbitmq.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

app.post("/api/command", async (req, res) => {
  const { command, value } = req.body;
  if (!command) {
    return res.status(400).json({ error: 'Missing "command" field' });
  }
  try {
    await sendCommand({ command, value });
    return res.status(202).json({ status: "queued", command, value });
  } catch (err) {
    console.error("Error enqueueing:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Producer HTTP API listening on port ${PORT}`);
});
