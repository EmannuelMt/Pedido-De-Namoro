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
