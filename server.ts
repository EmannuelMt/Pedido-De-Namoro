import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;
  
  app.use(express.json());

  // API Routes
  app.post("/api/generate-theme", async (req, res) => {
    try {
      const { description } = req.body;
      const { GoogleGenAI } = await import('@google/genai');
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `You are an expert UI designer. Generate a color palette for a romantic coupling experience based on this description: "${description}".
      
      You must respond ONLY with a valid JSON object matching this schema. Do not include any markdown formatting or markdown code blocks (e.g. \`\`\`json). Just the raw JSON object.

      {
        "primary": "hex code for primary accent color (vibrant, romantic, used for glows/buttons)",
        "bg": "hex code for very dark main background (e.g. #0a0a0a)",
        "bgAlt": "hex code for slightly lighter dark background (e.g. #111111 or dark tint)",
        "text": "hex code for main light text (e.g. #ffffff)"
      }`;

      // We use standard Gemini 2.5 Flash for speed
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
      });

      let jsonStr = response.text;
      // Strip markdown block if model accidentally provides it
      if (jsonStr) {
         jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
      }
      
      const colors = JSON.parse(jsonStr || "{}");
      res.json(colors);
    } catch(err) {
      console.error(err);
      res.status(500).json({ error: "Failed to generate theme" });
    }
  });

  // Games State
  const rooms = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", ({ roomId, userId, userName }) => {
      socket.join(roomId);
      console.log(`${userName} (${userId}) joined room: ${roomId}`);
      
      if (!rooms.has(roomId)) {
        rooms.set(roomId, { players: [], state: {} });
      }
      
      const room = rooms.get(roomId);
      if (!room.players.find(p => p.id === userId)) {
        room.players.push({ id: userId, name: userName, socketId: socket.id });
      }
      
      io.to(roomId).emit("room_update", room);
    });

    socket.on("game_action", ({ roomId, action }) => {
      const room = rooms.get(roomId);
      if (room) {
        // Emit the action to everyone in the room
        io.to(roomId).emit("game_event", action);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      // Clean up rooms (optional for now, or just let them stale)
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
