import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createQuestionAnswer } from "./llm.js";
import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;



// In-memory stores
let questions = [];
let answers = [];

// Keep SSE clients
let clients = [];

// Broadcast helper
function broadcast(event, data) {
  clients.forEach((res) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

// --- 1. POST /api/questions ---
app.post("/api/questions", async (req, res) => {
  const { userId, question } = req.body;
  const questionId = `q_${Date.now()}`;
  const answerId = `a_${Date.now()}`;

  // Save question
  const questionObj = { id: questionId, userId, question, answerId };
  questions.push(questionObj);

  // Notify via SSE
  broadcast("question_created", questionObj);

  // Get answer from LLM (text + visualization)
  const answer = await createQuestionAnswer(question, answerId);
  answers.push(answer);

  // Notify via SSE
  broadcast("answer_created", answer);

  res.json({ questionId, answerId });
});

// --- 2. GET /api/questions ---
app.get("/api/questions", (req, res) => {
  res.json(questions);
});

// --- 3. GET /api/answers/:id ---
app.get("/api/answers/:id", (req, res) => {
  const answer = answers.find((a) => a.id === req.params.id);
  if (answer) {
    res.json(answer);
  } else {
    res.status(404).json({ error: "Answer not found" });
  }
});

// --- 4. GET /api/stream (SSE) ---
app.get("/api/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  // Push res into clients array
  clients.push(res);

  // Remove client on close
  req.on("close", () => {
    clients = clients.filter((c) => c !== res);
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
