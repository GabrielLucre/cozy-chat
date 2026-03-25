const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { randomUUID } = require("crypto");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// In-memory state
const users = new Map(); // socketId -> { id, username }
const typingUsers = new Set();
const messageReactions = new Map(); // messageId -> { emoji: [usernames] }
const messageAuthors = new Map(); // messageId -> username

// Simple profanity filter
const BLOCKED = ["fuck", "shit", "ass", "bitch", "damn", "dick", "crap"];
function filterMessage(text) {
  let filtered = text;
  BLOCKED.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    filtered = filtered.replace(regex, "*".repeat(word.length));
  });
  return filtered;
}

function broadcastUsers() {
  const list = Array.from(users.values());
  io.emit("users", list);
}

function broadcastTyping() {
  const list = Array.from(typingUsers);
  io.emit("typing", list);
}

function isUsernameTaken(username) {
  for (const user of users.values()) {
    if (user.username.toLowerCase() === username.toLowerCase()) return true;
  }
  return false;
}

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("join", (username, callback) => {
    if (isUsernameTaken(username)) {
      if (typeof callback === "function") {
        callback({ error: "Nome de usuário já está em uso. Escolha outro." });
      }
      return;
    }

    const user = { id: socket.id, username };
    users.set(socket.id, user);
    broadcastUsers();

    if (typeof callback === "function") {
      callback({ success: true });
    }

    io.emit("system", {
      id: randomUUID(),
      type: "system",
      content: `${username} entrou no chat`,
      timestamp: Date.now(),
    });

    console.log(`${username} joined (${users.size} users online)`);
  });

  socket.on("message", (data) => {
    const user = users.get(socket.id);
    if (!user) return;

    const content = typeof data === "string" ? data : data.content;
    const replyTo = typeof data === "object" ? data.replyTo : undefined;

    if (!content || !content.trim()) return;

    const msgId = randomUUID();
    const msg = {
      id: msgId,
      type: "message",
      username: user.username,
      content: filterMessage(content.trim()),
      timestamp: Date.now(),
      reactions: {},
    };

    if (replyTo) {
      msg.replyTo = {
        id: replyTo.id,
        username: replyTo.username,
        content: replyTo.content,
      };
    }

    messageReactions.set(msgId, {});
    messageAuthors.set(msgId, user.username);

    io.emit("message", msg);
    typingUsers.delete(user.username);
    broadcastTyping();
  });

  socket.on("delete-message", (messageId) => {
    const user = users.get(socket.id);
    if (!user) return;

    const author = messageAuthors.get(messageId);
    if (author !== user.username) return; // only author can delete

    messageAuthors.delete(messageId);
    messageReactions.delete(messageId);
    io.emit("message-deleted", messageId);
  });

  socket.on("toggle-reaction", ({ messageId, emoji }) => {
    const user = users.get(socket.id);
    if (!user) return;

    let reactions = messageReactions.get(messageId);
    if (!reactions) {
      reactions = {};
      messageReactions.set(messageId, reactions);
    }

    if (!reactions[emoji]) reactions[emoji] = [];

    const idx = reactions[emoji].indexOf(user.username);
    if (idx >= 0) {
      reactions[emoji].splice(idx, 1);
    } else {
      reactions[emoji].push(user.username);
    }

    io.emit("reaction-updated", { messageId, reactions: { ...reactions } });
  });

  socket.on("nick", (newName, callback) => {
    const user = users.get(socket.id);
    if (!user) return;

    if (!newName || newName.trim().length < 2 || newName.trim().length > 20) {
      if (typeof callback === "function") callback({ error: "Nome deve ter entre 2 e 20 caracteres." });
      return;
    }

    const trimmed = newName.trim();
    if (isUsernameTaken(trimmed)) {
      if (typeof callback === "function") callback({ error: "Nome de usuário já está em uso." });
      return;
    }

    const oldName = user.username;
    typingUsers.delete(oldName);
    user.username = trimmed;
    users.set(socket.id, user);
    broadcastUsers();
    broadcastTyping();

    if (typeof callback === "function") callback({ success: true, username: trimmed });

    io.emit("system", {
      id: randomUUID(),
      type: "system",
      content: `${oldName} agora é ${trimmed}`,
      timestamp: Date.now(),
    });
  });

  socket.on("typing", () => {
    const user = users.get(socket.id);
    if (!user) return;
    typingUsers.add(user.username);
    broadcastTyping();
  });

  socket.on("stop-typing", () => {
    const user = users.get(socket.id);
    if (!user) return;
    typingUsers.delete(user.username);
    broadcastTyping();
  });

  socket.on("disconnect", () => {
    const user = users.get(socket.id);
    if (user) {
      typingUsers.delete(user.username);
      users.delete(socket.id);
      broadcastUsers();
      broadcastTyping();

      io.emit("system", {
        id: randomUUID(),
        type: "system",
        content: `${user.username} saiu do chat`,
        timestamp: Date.now(),
      });

      console.log(`${user.username} left (${users.size} users online)`);
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🚀 Chat server running on http://0.0.0.0:${PORT}`);
  console.log(`   Share your local IP with others on the network to connect!\n`);
});
