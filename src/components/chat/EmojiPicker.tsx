import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smile } from "lucide-react";

const EMOJI_CATEGORIES: { label: string; emojis: string[] }[] = [
  {
    label: "Smileys",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "😮‍💨", "🤥"],
  },
  {
    label: "Gestures",
    emojis: ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🙏", "💪"],
  },
  {
    label: "Hearts",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟"],
  },
  {
    label: "Objects",
    emojis: ["🔥", "⭐", "🌟", "✨", "💫", "🎉", "🎊", "🎈", "🎁", "🏆", "🥇", "🎯", "💡", "📌", "📎", "✅", "❌", "⚠️", "🚀", "💯", "🎵", "🎶", "☕", "🍕", "🍔", "🌮", "🍩", "🍺", "🥂", "🎮"],
  },
  {
    label: "Faces",
    emojis: ["😢", "😭", "😤", "😠", "😡", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺", "👻", "👽", "🤖", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"],
  },
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const EmojiPicker = ({ onSelect }: EmojiPickerProps) => {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const pickerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={pickerRef}>
      <motion.button
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Emoji picker"
      >
        <Smile className="h-5 w-5" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop to close */}
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-12 left-0 z-40 w-72 rounded-xl border bg-card shadow-xl"
            >
              {/* Category tabs */}
              <div className="flex gap-1 border-b px-2 py-1.5 overflow-x-auto scrollbar-thin">
                {EMOJI_CATEGORIES.map((cat, i) => (
                  <button
                    key={cat.label}
                    onClick={() => setActiveCategory(i)}
                    className={`shrink-0 rounded-lg px-2 py-1 text-xs font-medium transition-colors ${
                      activeCategory === i
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Emoji grid */}
              <div className="grid grid-cols-8 gap-0.5 p-2 max-h-48 overflow-y-auto scrollbar-thin">
                {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => { onSelect(emoji); setOpen(false); }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-lg hover:bg-muted transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmojiPicker;
