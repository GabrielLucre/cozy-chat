import { motion } from "framer-motion";

interface MessageBubbleProps {
  content: string;
  username: string;
  timestamp: number;
  isOwn: boolean;
  showName: boolean;
}

const MessageBubble = ({ content, username, timestamp, isOwn, showName }: MessageBubbleProps) => {
  const time = new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
    >
      {showName && !isOwn && (
        <span className="mb-0.5 ml-3 text-xs font-medium text-muted-foreground">
          {username}
        </span>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isOwn
            ? "bg-bubble-own text-bubble-own-foreground rounded-br-md"
            : "bg-bubble-other text-bubble-other-foreground rounded-bl-md"
        }`}
      >
        {content}
      </div>
      <span className="mt-0.5 px-3 text-[10px] text-muted-foreground">{time}</span>
    </motion.div>
  );
};

export default MessageBubble;
