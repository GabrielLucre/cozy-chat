import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

interface ThemeToggleProps {
  dark: boolean;
  toggle: () => void;
}

const ThemeToggle = ({ dark, toggle }: ThemeToggleProps) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={toggle}
    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    aria-label="Toggle theme"
  >
    {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
  </motion.button>
);

export default ThemeToggle;
