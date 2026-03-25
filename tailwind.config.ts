import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        border: "oklch(var(--b3) / <alpha-value>)",
        input: "oklch(var(--b3) / <alpha-value>)",
        ring: "oklch(var(--p) / <alpha-value>)",
        background: "oklch(var(--b1) / <alpha-value>)",
        foreground: "oklch(var(--bc) / <alpha-value>)",
        primary: {
          DEFAULT: "oklch(var(--p) / <alpha-value>)",
          foreground: "oklch(var(--pc) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "oklch(var(--s) / <alpha-value>)",
          foreground: "oklch(var(--sc) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "oklch(var(--er) / <alpha-value>)",
          foreground: "oklch(var(--erc) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "oklch(var(--b2) / <alpha-value>)",
          foreground: "oklch(var(--bc) / 0.6)",
        },
        accent: {
          DEFAULT: "oklch(var(--a) / <alpha-value>)",
          foreground: "oklch(var(--ac) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "oklch(var(--b1) / <alpha-value>)",
          foreground: "oklch(var(--bc) / <alpha-value>)",
        },
        card: {
          DEFAULT: "oklch(var(--b2) / <alpha-value>)",
          foreground: "oklch(var(--bc) / <alpha-value>)",
        },
        bubble: {
          own: "oklch(var(--bubble-own) / <alpha-value>)",
          "own-foreground": "oklch(var(--bubble-own-foreground) / <alpha-value>)",
          other: "oklch(var(--bubble-other) / <alpha-value>)",
          "other-foreground": "oklch(var(--bubble-other-foreground) / <alpha-value>)",
        },
        system: "oklch(var(--system-message) / <alpha-value>)",
        sidebar: {
          DEFAULT: "oklch(var(--b2) / <alpha-value>)",
          foreground: "oklch(var(--bc) / <alpha-value>)",
          primary: "oklch(var(--p) / <alpha-value>)",
          "primary-foreground": "oklch(var(--pc) / <alpha-value>)",
          accent: "oklch(var(--a) / <alpha-value>)",
          "accent-foreground": "oklch(var(--ac) / <alpha-value>)",
          border: "oklch(var(--b3) / <alpha-value>)",
          ring: "oklch(var(--p) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("daisyui")],
  daisyui: {
    themes: [
      "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
      "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
      "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
      "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade",
      "night", "coffee", "winter", "dim", "nord", "sunset",
    ],
  },
} satisfies Config;
