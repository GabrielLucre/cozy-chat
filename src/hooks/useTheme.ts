import { useEffect, useState } from "react";

const DAISY_THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
  "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
  "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
  "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade",
  "night", "coffee", "winter", "dim", "nord", "sunset",
] as const;

export type DaisyTheme = (typeof DAISY_THEMES)[number];

export function useTheme() {
  const [theme, setTheme] = useState<DaisyTheme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("chat-theme") as DaisyTheme) || "light";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("chat-theme", theme);
  }, [theme]);

  const dark = [
    "dark", "synthwave", "halloween", "forest", "black", "luxury",
    "dracula", "business", "night", "coffee", "dim", "sunset",
  ].includes(theme);

  return { theme, setTheme, dark, themes: DAISY_THEMES };
}
