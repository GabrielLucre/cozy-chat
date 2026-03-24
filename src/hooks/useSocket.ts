import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";

export interface ChatMessage {
  id: string;
  type: "message" | "system";
  username?: string;
  content: string;
  timestamp: number;
}

export interface OnlineUser {
  id: string;
  username: string;
}

const SERVER_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout>>();

  const connect = useCallback((name: string) => {
    const s = io(SERVER_URL, { transports: ["websocket", "polling"] });

    s.on("connect", () => {
      setConnected(true);
      s.emit("join", name);
      setUsername(name);
    });

    s.on("disconnect", () => setConnected(false));
    s.on("message", (msg: ChatMessage) => setMessages((prev) => [...prev, msg]));
    s.on("system", (msg: ChatMessage) => setMessages((prev) => [...prev, msg]));
    s.on("users", (users: OnlineUser[]) => setOnlineUsers(users));
    s.on("typing", (users: string[]) => setTypingUsers(users));

    setSocket(s);
    return () => { s.disconnect(); };
  }, []);

  const sendMessage = useCallback((content: string) => {
    socket?.emit("message", content);
  }, [socket]);

  const sendTyping = useCallback(() => {
    socket?.emit("typing");
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => socket?.emit("stop-typing"), 2000);
  }, [socket]);

  useEffect(() => {
    return () => { socket?.disconnect(); };
  }, [socket]);

  return { connected, messages, onlineUsers, typingUsers, username, connect, sendMessage, sendTyping };
}
