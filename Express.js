import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let clients = []; // all active SSE clients

// --- SSE endpoint ---
app.get("/api/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send a comment every 20s to keep connection alive
  const keepAlive = setInterval(() => {
    res.write(": keep-alive\n\n");
  }, 20000);

  // Save client connection
  clients.push(res);

  req.on("close", () => {
    clearInterval(keepAlive);
    clients = clients.filter((c) => c !== res);
  });
});

// --- Helper: broadcast an event ---
function broadcast(event, data) {
  clients.forEach((res) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

// --- Example API: submit question ---
app.post("/api/questions", async (req, res) => {
  const { userId, question } = req.body;

  const questionId = "q_" + Date.now();
  const answerId = "a_" + Date.now();

  // Fake "LLM" response
  const answer = {
    id: answerId,
    text: `Here’s a simple explanation for: ${question}`,
    visualization: {
      id: "vis_generic",
      duration: 2000,
      fps: 30,
      layers: []
    }
  };

  // Broadcast events in real-time
  broadcast("question_created", { id: questionId, userId, question, answerId });
  broadcast("answer_created", answer);

  res.json({ questionId, answerId });
});

app.listen(4000, () => console.log("✅ Backend running on http://localhost:4000"));
