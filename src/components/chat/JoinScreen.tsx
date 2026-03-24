import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface JoinScreenProps {
  onJoin: (name: string) => void;
}

const JoinScreen = ({ onJoin }: JoinScreenProps) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length >= 2 && trimmed.length <= 20) {
      onJoin(trimmed);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary"
          >
            <MessageCircle className="h-8 w-8 text-primary-foreground" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight">LAN Chat</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Join the conversation on your local network
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your display name..."
              maxLength={20}
              autoFocus
              className="w-full rounded-xl border bg-card px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground outline-none ring-ring focus:ring-2 transition-shadow"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              2–20 characters
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={name.trim().length < 2}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
          >
            Join Chat
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default JoinScreen;
