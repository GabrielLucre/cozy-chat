import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";

export interface Reactions {
  [emoji: string]: string[];
}

export interface ReplyTo {
  id: string;
  username: string;
  content: string;
}

export interface ChatMessage {
  id: string;
  type: "message" | "system";
  username?: string;
  content: string;
  timestamp: number;
  reactions?: Reactions;
  replyTo?: ReplyTo;
}

export interface OnlineUser {
  id: string;
  username: string;
}

export const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

const SERVER_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout>>();

  const connect = useCallback((name: string): Promise<{ error?: string }> => {
    return new Promise((resolve) => {
      const s = io(SERVER_URL, { transports: ["websocket", "polling"] });

      s.on("connect", () => {
        setConnected(true);
        s.emit("join", name, (response: { error?: string; success?: boolean }) => {
          if (response?.error) {
            s.disconnect();
            resolve({ error: response.error });
          } else {
            setUsername(name);
            resolve({});
          }
        });
      });

      s.on("disconnect", () => setConnected(false));
      s.on("message", (msg: ChatMessage) => setMessages((prev) => [...prev, msg]));
      s.on("system", (msg: ChatMessage) => setMessages((prev) => [...prev, msg]));
      s.on("users", (users: OnlineUser[]) => setOnlineUsers(users));
      s.on("typing", (users: string[]) => setTypingUsers(users));

      s.on("reaction-updated", ({ messageId, reactions }: { messageId: string; reactions: Reactions }) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, reactions } : m))
        );
      });

      s.on("message-deleted", (messageId: string) => {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      });

      setSocket(s);
    });
  }, []);

  const sendMessage = useCallback((content: string, replyTo?: ReplyTo) => {
    socket?.emit("message", { content, replyTo });
  }, [socket]);

  const deleteMessage = useCallback((messageId: string) => {
    socket?.emit("delete-message", messageId);
  }, [socket]);

  const sendTyping = useCallback(() => {
    socket?.emit("typing");
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => socket?.emit("stop-typing"), 2000);
  }, [socket]);

  const toggleReaction = useCallback((messageId: string, emoji: string) => {
    socket?.emit("toggle-reaction", { messageId, emoji });
  }, [socket]);

  const changeNick = useCallback((newName: string): Promise<{ error?: string; username?: string }> => {
    return new Promise((resolve) => {
      if (!socket) { resolve({ error: "Não conectado." }); return; }
      socket.emit("nick", newName, (response: { error?: string; success?: boolean; username?: string }) => {
        if (response?.error) {
          resolve({ error: response.error });
        } else {
          setUsername(response.username || newName);
          resolve({ username: response.username || newName });
        }
      });
    });
  }, [socket]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    return () => { socket?.disconnect(); };
  }, [socket]);

  return { connected, messages, onlineUsers, typingUsers, username, connect, sendMessage, deleteMessage, sendTyping, toggleReaction, changeNick, clearMessages };
}
