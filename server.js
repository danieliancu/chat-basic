import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

// Încărcare variabile de mediu
dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configurare OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Cheia API din fișierul .env
});

// Endpoint pentru trimiterea cererilor către OpenAI
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request format. "messages" must be an array.' });
  }

  try {
    const userMessage = messages[messages.length - 1]?.content.toLowerCase();

    // Logică personalizată pentru răspunsuri speciale
    if (userMessage.includes('hello')) {
      return res.json({ message: 'Bună, cum pot să te ajut azi?' });
    }
    if (userMessage.includes('ajutor')) {
      return res.json({ message: 'Sigur, te pot ajuta cu orice legat de sănătate și bio' });
    }

    const systemMessage = {
      role: 'system',
      content: 'Ești un chatbot care oferă răspunsuri prietenoase despre îngrijire fără chimicale, produse bio și despre cum să trăiești sănătos.',
    };

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, ...messages],
    });

    res.json({ message: response.choices[0].message.content });
  } catch (error) {
    console.error('Error with OpenAI API:', error.message);
    res.status(500).json({ error: 'Internal server error while communicating with OpenAI.' });
  }
});

// Pornire server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
