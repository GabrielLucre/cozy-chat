import { Palette } from "lucide-react";
import { motion } from "framer-motion";
import type { DaisyTheme } from "@/hooks/useTheme";

interface ThemeToggleProps {
  theme: DaisyTheme;
  themes: readonly DaisyTheme[];
  setTheme: (t: DaisyTheme) => void;
}

const ThemeToggle = ({ theme, themes, setTheme }: ThemeToggleProps) => (
  <div className="dropdown dropdown-end">
    <motion.button
      whileTap={{ scale: 0.9 }}
      tabIndex={0}
      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label="Selecionar tema"
    >
      <Palette className="h-4 w-4" />
    </motion.button>
    <ul
      tabIndex={0}
      className="dropdown-content z-50 mt-2 max-h-72 w-48 overflow-y-auto rounded-lg border bg-popover p-1.5 shadow-lg scrollbar-thin"
    >
      {themes.map((t) => (
        <li key={t}>
          <button
            onClick={() => setTheme(t)}
            className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm capitalize transition-colors hover:bg-muted ${
              t === theme ? "font-semibold text-primary" : "text-popover-foreground"
            }`}
          >
            <span
              data-theme={t}
              className="flex h-4 w-4 shrink-0 overflow-hidden rounded-full"
            >
              <span className="h-full w-1/2 bg-primary" />
              <span className="h-full w-1/2 bg-secondary" />
            </span>
            {t}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default ThemeToggle;
