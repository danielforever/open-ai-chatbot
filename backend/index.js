const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config(); // Load .env file

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let chatStore = {}; // Temporary in-memory store (use DB later)

// POST route to handle chat messages
app.post("/api/chat", async (req, res) => {
  const { prompt, chatId = "default", model = "gpt-3.5-turbo" } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt is required." });

  // Initialize chat history
  if (!chatStore[chatId]) chatStore[chatId] = [];

  // Add user's message
  chatStore[chatId].push({ role: "user", content: prompt });

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: chatStore[chatId], // Pass full chat
    });

    const reply = completion.choices[0].message.content;

    // Add assistant response to chat history
    chatStore[chatId].push({ role: "assistant", content: reply });

    res.json({ result: reply, chatHistory: chatStore[chatId] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI request failed." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server is running on port ${PORT}`);
});
