import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Users, X } from "lucide-react";
import { useSocket, ChatMessage, ReplyTo } from "@/hooks/useSocket";
import { useTheme } from "@/hooks/useTheme";
import MessageBubble from "./MessageBubble";
import SystemMessage from "./SystemMessage";
import UsersList from "./UsersList";
import ThemeToggle from "./ThemeToggle";
import EmojiPicker from "./EmojiPicker";

interface ChatRoomProps {
  initialUsername: string;
}

const ChatRoom = ({ initialUsername }: ChatRoomProps) => {
  const { connected, messages, onlineUsers, typingUsers, username, connect, sendMessage, sendTyping, toggleReaction } = useSocket();
  const { dark, toggle } = useTheme();
  const [input, setInput] = useState("");
  const [showUsers, setShowUsers] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ReplyTo | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasConnected = useRef(false);

  useEffect(() => {
    if (!hasConnected.current) {
      hasConnected.current = true;
      connect(initialUsername);
    }
  }, [initialUsername, connect]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    sendMessage(trimmed, replyingTo || undefined);
    setInput("");
    setReplyingTo(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape" && replyingTo) {
      setReplyingTo(null);
    }
  };

  const handleReply = (msg: ChatMessage) => {
    setReplyingTo({ id: msg.id, username: msg.username!, content: msg.content });
    inputRef.current?.focus();
  };

  const shouldShowName = (msg: ChatMessage, i: number) => {
    if (msg.type !== "message") return false;
    const prev = messages[i - 1];
    return !prev || prev.type !== "message" || prev.username !== msg.username;
  };

  const filteredTyping = typingUsers.filter((u) => u !== username);

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-bold tracking-tight">LAN Chat</h1>
          {connected ? (
            <span className="h-2 w-2 rounded-full bg-accent" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          )}
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle dark={dark} toggle={toggle} />
          <button
            onClick={() => setShowUsers(!showUsers)}
            className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Users className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {onlineUsers.length}
            </span>
          </button>
        </div>
      </header>

      <div className="relative flex flex-1 overflow-hidden">
        <main className="flex flex-1 flex-col overflow-y-auto scrollbar-thin px-4 py-3">
          <div className="mt-auto flex flex-col gap-2">
            {messages.map((msg, i) =>
              msg.type === "system" ? (
                <SystemMessage key={msg.id} content={msg.content} />
              ) : (
                <MessageBubble
                  key={msg.id}
                  content={msg.content}
                  username={msg.username!}
                  timestamp={msg.timestamp}
                  isOwn={msg.username === username}
                  showName={shouldShowName(msg, i)}
                  reactions={msg.reactions}
                  currentUser={username}
                  replyTo={msg.replyTo}
                  onReact={(emoji) => toggleReaction(msg.id, emoji)}
                  onReply={() => handleReply(msg)}
                />
              )
            )}

            {filteredTyping.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-muted-foreground italic ml-3"
              >
                {filteredTyping.join(", ")} {filteredTyping.length === 1 ? "está digitando…" : "estão digitando…"}
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>
        </main>

        <AnimatePresence>
          {showUsers && (
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 z-10 h-full w-56 border-l bg-card shadow-lg md:relative md:shadow-none"
            >
              <div className="flex items-center justify-between border-b px-3 py-2 md:hidden">
                <span className="text-xs font-semibold text-muted-foreground">Usuários</span>
                <button onClick={() => setShowUsers(false)} className="text-muted-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <UsersList users={onlineUsers} currentUser={username} />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Reply preview bar */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden border-t"
          >
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2">
              <div className="flex-1 min-w-0 border-l-2 border-primary pl-2.5">
                <span className="text-xs font-semibold text-primary">{replyingTo.username}</span>
                <p className="text-xs text-muted-foreground truncate">{replyingTo.content}</p>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="shrink-0 rounded-lg p-1 text-muted-foreground hover:bg-muted transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t px-4 py-3">
        <div className="flex items-center gap-2">
          <EmojiPicker onSelect={(emoji) => { setInput((v) => v + emoji); inputRef.current?.focus(); }} />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); sendTyping(); }}
            onKeyDown={handleKeyDown}
            placeholder={replyingTo ? `Respondendo a ${replyingTo.username}...` : "Digite uma mensagem..."}
            className="flex-1 rounded-xl border bg-card px-4 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground outline-none ring-ring focus:ring-2 transition-shadow"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
      </footer>
    </div>
  );
};

export default ChatRoom;
