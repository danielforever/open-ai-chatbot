const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");
const container = require("./cosmos");

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
  const { prompt, chatId, projectId, session } = req.body;
  const userId = session?.email;

  if (!prompt || !session?.email) {
    return res.status(400).json({ error: "Missing prompt or session" });
  }

  // 1. Get chat history
  const history = await getChatHistory(chatId, 10); // last 10 messages

  console.log(`User ${session.email} asked: ${prompt}`);

  // Optionally: Store session.user.email to tag history
  // 2. Build messages array for OpenAI
  const messages = history.map(m => ({ role: m.role, content: m.content }));
  messages.push({ role: "user", content: prompt });

  // 3. Call OpenAI
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  
  const result = chatCompletion.choices[0].message.content;
  console.log(`${result}`);
  // 4. Save user and assistant messages
  await saveMessage({ userId, projectId, chatId, role: "user", content: prompt });
  await saveMessage({ userId, projectId, chatId, role: "assistant", content: result });
  res.json({ result });
});

// Save a message
async function saveMessage({ userId, projectId, chatId, role, content }) {
  const doc = {
    id: require("crypto").randomUUID(),
    userId,
    projectId,
    chatId,
    role,
    content,
    createdAt: new Date().toISOString(),
  };
  await container.items.create(doc);
}

// Get chat history
async function getChatHistory(chatId, limit = 10) {
  const querySpec = {
    query: "SELECT * FROM c WHERE c.chatId = @chatId ORDER BY c.createdAt ASC OFFSET 0 LIMIT @limit",
    parameters: [
      { name: "@chatId", value: chatId },
      { name: "@limit", value: limit },
    ],
  };
  const { resources } = await container.items.query(querySpec).fetchAll();
  return resources;
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server is running on port ${PORT}`);
});

