import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client with API Key
  let ai: GoogleGenAI | null = null;
  try {
    if (process.env.GEMINI_API_KEY) {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } else {
      console.warn("⚠️ GEMINI_API_KEY is not defined. AI Chat functions will run in offline mode.");
    }
  } catch (error) {
    console.error("Error setting up GoogleGenAI client:", error);
  }

  // AI Chat Support for JEE/NEET/UPSC/Board students with cultural safety references (iCall, Vandrevala Foundation)
  app.post("/api/chat", async (req: express.Request, res: express.Response) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        res.status(400).json({ error: "Message is required." });
        return;
      }

      if (!ai) {
        // Fallback message when api key is not defined, explaining how user can configure it gracefully
        res.json({
           text: `**Hello! I am MindSpace, your wellness assistant.** 
           
I am currently operating in offline mode because the \`GEMINI_API_KEY\` is not set in the environment variables.

You can still use all tracking, journal reflections, trigger heatmaps, and local crisis resource tools offline. To enable the live AI Wellness Chat, please add your key in **Settings > Secrets** in your Google AI Studio dashboard.`
        });
        return;
      }

      const systemInstruction = `You are a compassionate, non-judgmental, and culturally sensitive Mental Wellness Assistant named MindSpace.
Your primary role is to support Indian students preparing for intense competitive exams such as JEE, NEET, UPSC, Board Exams, CAT, GATE, CUET, etc.
These students face severe syllabus overload, heavy peer pressure, intense family expectations, sleep deprivation, and mock test performance anxiety.

Guidelines:
1. Provide gentle, uplifting, and practical recommendations (like simple 4-7-8 breathing exercises, Pomodoro technique, mini-breaks, or positive sleep hygiene).
2. NEVER prescribe psychiatric medicine or claim to replace professional therapists.
3. Be highly empathetic and conversational. Ask warm, helpful questions. Speak with Indian cultural references where helpful (like encouraging "chai breaks", talking about family pressure respectfully but firmly, or advising that mock test scores do NOT define their actual human worth).
4. If the user expresses severe distress, self-harm thoughts, or overwhelming anxiety, always gently and prominently surface these professional helplines:
   - iCall (TISS Helpline): 9152987821 (Mon-Sat, 10 AM - 8 PM)
   - Vandrevala Foundation: 9999666555 (24/7, Free & Confidential)
   - AASRA: 91-9820466726 (24/7)
5. Format your response beautifully in clear Markdown with lists, bullet points, or bold text for easy reading. Keep responses concise so students aren't overwhelmed by long essays. Max 3-4 paragraphs.`;

      const contents = [];
      
      if (Array.isArray(history)) {
        for (const msg of history) {
          contents.push({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }]
          });
        }
      }
      
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error?.message || "An error occurred while communicating with the AI service." });
    }
  });

  // Sync store in memory for demonstrating a private encrypted server-sync
  const cloudSyncStore = new Map<string, string>();

  app.post("/api/sync/upload", (req: express.Request, res: express.Response) => {
    const { syncKey, data } = req.body;
    if (!syncKey || !data) {
      res.status(400).json({ error: "syncKey and data are required." });
      return;
    }
    cloudSyncStore.set(syncKey, data);
    res.json({ success: true, message: "Backup successfully stored in temporary cloud sync store!" });
  });

  app.post("/api/sync/download", (req: express.Request, res: express.Response) => {
    const { syncKey } = req.body;
    if (!syncKey) {
      res.status(400).json({ error: "syncKey is required." });
      return;
    }
    const data = cloudSyncStore.get(syncKey);
    if (!data) {
      res.status(404).json({ error: "Backup not found for this key. Please make sure the Sync Key is correct." });
      return;
    }
    res.json({ success: true, data });
  });

  // Serve frontend assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
