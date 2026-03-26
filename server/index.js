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

// Admin config
const ADMIN_USERNAME = "Zee";
const ADMIN_PASSWORD = "User0660";

// In-memory state
const users = new Map(); // socketId -> { id, username, isAdmin }
const typingUsers = new Set();
const messageReactions = new Map();
const messageAuthors = new Map();
const mutedUsers = new Set(); // usernames that are muted

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
  const list = Array.from(users.values()).map((u) => ({
    id: u.id,
    username: u.username,
    isAdmin: u.isAdmin || false,
  }));
  io.emit("users", list);
}

function broadcastTyping() {
  io.emit("typing", Array.from(typingUsers));
}

function isUsernameTaken(username) {
  for (const user of users.values()) {
    if (user.username.toLowerCase() === username.toLowerCase()) return true;
  }
  return false;
}

function findSocketByUsername(username) {
  for (const [socketId, user] of users.entries()) {
    if (user.username.toLowerCase() === username.toLowerCase()) return socketId;
  }
  return null;
}

function emitSystem(content) {
  io.emit("system", {
    id: randomUUID(),
    type: "system",
    content,
    timestamp: Date.now(),
  });
}

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("join", ({ username, password }, callback) => {
    // Support both old format (string) and new format (object)
    const name = typeof arguments[0] === "string" ? arguments[0] : username;

    if (isUsernameTaken(name)) {
      if (typeof callback === "function") {
        callback({ error: "Nome de usuário já está em uso. Escolha outro." });
      }
      return;
    }

    const isAdminAttempt = name.toLowerCase() === ADMIN_USERNAME.toLowerCase();

    if (isAdminAttempt) {
      if (password !== ADMIN_PASSWORD) {
        if (typeof callback === "function") {
          callback({ error: "Senha de administrador incorreta." });
        }
        return;
      }
    }

    const user = { id: socket.id, username: name, isAdmin: isAdminAttempt };
    users.set(socket.id, user);
    broadcastUsers();

    if (typeof callback === "function") {
      callback({ success: true, isAdmin: isAdminAttempt });
    }

    emitSystem(`${name} entrou no chat`);
    console.log(`${name} joined${isAdminAttempt ? " (admin)" : ""} (${users.size} users online)`);
  });

  socket.on("message", (data) => {
    const user = users.get(socket.id);
    if (!user) return;

    if (mutedUsers.has(user.username.toLowerCase())) {
      socket.emit("system", {
        id: randomUUID(),
        type: "system",
        content: "Você está silenciado e não pode enviar mensagens.",
        timestamp: Date.now(),
      });
      return;
    }

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
    // Admin can delete any message, others only their own
    if (!user.isAdmin && author !== user.username) return;

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

    // Prevent changing to admin name
    if (trimmed.toLowerCase() === ADMIN_USERNAME.toLowerCase() && !user.isAdmin) {
      if (typeof callback === "function") callback({ error: "Este nome é reservado." });
      return;
    }

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

    emitSystem(`${oldName} agora é ${trimmed}`);
  });

  // Admin commands
  socket.on("admin-kick", (targetUsername, callback) => {
    const user = users.get(socket.id);
    if (!user || !user.isAdmin) {
      if (typeof callback === "function") callback({ error: "Sem permissão." });
      return;
    }

    const targetSocketId = findSocketByUsername(targetUsername);
    if (!targetSocketId) {
      if (typeof callback === "function") callback({ error: "Usuário não encontrado." });
      return;
    }

    const targetSocket = io.sockets.sockets.get(targetSocketId);
    if (targetSocket) {
      targetSocket.emit("kicked", "Você foi removido do chat pelo administrador.");
      targetSocket.disconnect(true);
    }

    emitSystem(`${targetUsername} foi removido do chat por ${user.username}`);
    if (typeof callback === "function") callback({ success: true });
  });

  socket.on("admin-clearall", (_, callback) => {
    const user = users.get(socket.id);
    if (!user || !user.isAdmin) {
      if (typeof callback === "function") callback({ error: "Sem permissão." });
      return;
    }

    messageReactions.clear();
    messageAuthors.clear();
    io.emit("clear-all");
    emitSystem(`${user.username} limpou todas as mensagens`);
    if (typeof callback === "function") callback({ success: true });
  });

  socket.on("admin-mute", (targetUsername, callback) => {
    const user = users.get(socket.id);
    if (!user || !user.isAdmin) {
      if (typeof callback === "function") callback({ error: "Sem permissão." });
      return;
    }

    const targetSocketId = findSocketByUsername(targetUsername);
    if (!targetSocketId) {
      if (typeof callback === "function") callback({ error: "Usuário não encontrado." });
      return;
    }

    mutedUsers.add(targetUsername.toLowerCase());
    emitSystem(`${targetUsername} foi silenciado por ${user.username}`);
    if (typeof callback === "function") callback({ success: true });
  });

  socket.on("admin-unmute", (targetUsername, callback) => {
    const user = users.get(socket.id);
    if (!user || !user.isAdmin) {
      if (typeof callback === "function") callback({ error: "Sem permissão." });
      return;
    }

    if (!mutedUsers.has(targetUsername.toLowerCase())) {
      if (typeof callback === "function") callback({ error: "Usuário não está silenciado." });
      return;
    }

    mutedUsers.delete(targetUsername.toLowerCase());
    emitSystem(`${targetUsername} foi dessilenciado por ${user.username}`);
    if (typeof callback === "function") callback({ success: true });
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
      mutedUsers.delete(user.username.toLowerCase());
      users.delete(socket.id);
      broadcastUsers();
      broadcastTyping();
      emitSystem(`${user.username} saiu do chat`);
      console.log(`${user.username} left (${users.size} users online)`);
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🚀 Chat server running on http://0.0.0.0:${PORT}`);
  console.log(`   Share your local IP with others on the network to connect!\n`);
});
