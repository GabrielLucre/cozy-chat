import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reply } from "lucide-react";
import { REACTION_EMOJIS, Reactions, ReplyTo } from "@/hooks/useSocket";

interface MessageBubbleProps {
  content: string;
  username: string;
  timestamp: number;
  isOwn: boolean;
  showName: boolean;
  reactions?: Reactions;
  currentUser: string | null;
  replyTo?: ReplyTo;
  onReact: (emoji: string) => void;
  onReply: () => void;
}

const MessageBubble = ({ content, username, timestamp, isOwn, showName, reactions, currentUser, replyTo, onReact, onReply }: MessageBubbleProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const time = new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const activeReactions = reactions
    ? Object.entries(reactions).filter(([, users]) => users.length > 0)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`group flex flex-col ${isOwn ? "items-end" : "items-start"}`}
    >
      {showName && !isOwn && (
        <span className="mb-0.5 ml-3 text-xs font-medium text-muted-foreground">
          {username}
        </span>
      )}

      <div className="relative">
        <div
          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isOwn
              ? "bg-bubble-own text-bubble-own-foreground rounded-br-md"
              : "bg-bubble-other text-bubble-other-foreground rounded-bl-md"
          }`}
        >
          {/* Reply quote block */}
          {replyTo && (
            <div className={`mb-2 rounded-lg border-l-2 border-primary/50 px-2.5 py-1.5 text-xs ${
              isOwn ? "bg-bubble-own-foreground/5" : "bg-bubble-other-foreground/5"
            }`}>
              <span className="font-semibold text-primary">{replyTo.username}</span>
              <p className="mt-0.5 line-clamp-2 text-muted-foreground">{replyTo.content}</p>
            </div>
          )}
          {content}
        </div>

        {/* Action buttons on hover */}
        <div className={`absolute top-1/2 -translate-y-1/2 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${
          isOwn ? "-left-16" : "-right-16"
        }`}>
          <button
            onClick={onReply}
            className="rounded-full h-6 w-6 flex items-center justify-center bg-muted text-muted-foreground text-xs hover:bg-secondary transition-colors"
            title="Reply"
          >
            <Reply className="h-3 w-3" />
          </button>
          <button
            onClick={() => setShowPicker((p) => !p)}
            className="rounded-full h-6 w-6 flex items-center justify-center bg-muted text-muted-foreground text-xs hover:bg-secondary transition-colors"
          >
            😊
          </button>
        </div>

        {/* Emoji picker popover */}
        <AnimatePresence>
          {showPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className={`absolute z-20 top-full mt-1 flex gap-0.5 rounded-xl border bg-card p-1.5 shadow-lg ${
                isOwn ? "right-0" : "left-0"
              }`}
            >
              {REACTION_EMOJIS.map((emoji) => {
                const reacted = reactions?.[emoji]?.includes(currentUser || "");
                return (
                  <button
                    key={emoji}
                    onClick={() => { onReact(emoji); setShowPicker(false); }}
                    className={`h-8 w-8 rounded-lg text-base transition-colors hover:bg-muted ${
                      reacted ? "bg-secondary" : ""
                    }`}
                  >
                    {emoji}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reaction badges */}
      {activeReactions.length > 0 && (
        <div className={`flex flex-wrap gap-1 mt-0.5 px-2 ${isOwn ? "justify-end" : "justify-start"}`}>
          {activeReactions.map(([emoji, users]) => {
            const reacted = users.includes(currentUser || "");
            return (
              <button
                key={emoji}
                onClick={() => onReact(emoji)}
                className={`flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-xs transition-colors ${
                  reacted
                    ? "border-primary/30 bg-primary/10 text-foreground"
                    : "border-border bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
                title={users.join(", ")}
              >
                <span>{emoji}</span>
                <span className="font-medium">{users.length}</span>
              </button>
            );
          })}
        </div>
      )}

      <span className="mt-0.5 px-3 text-[10px] text-muted-foreground">{time}</span>
    </motion.div>
  );
};

export default MessageBubble;
