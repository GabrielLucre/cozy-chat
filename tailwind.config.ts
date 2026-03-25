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
        border: "var(--color-base-300)",
        input: "var(--color-base-300)",
        ring: "var(--color-primary)",
        background: "var(--color-base-100)",
        foreground: "var(--color-base-content)",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-content)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-content)",
        },
        destructive: {
          DEFAULT: "var(--color-error)",
          foreground: "var(--color-error-content)",
        },
        muted: {
          DEFAULT: "var(--color-base-200)",
          foreground: "var(--color-base-content)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-content)",
        },
        popover: {
          DEFAULT: "var(--color-base-100)",
          foreground: "var(--color-base-content)",
        },
        card: {
          DEFAULT: "var(--color-base-200)",
          foreground: "var(--color-base-content)",
        },
        bubble: {
          own: "var(--color-primary)",
          "own-foreground": "var(--color-primary-content)",
          other: "var(--color-base-200)",
          "other-foreground": "var(--color-base-content)",
        },
        system: "var(--color-base-content)",
        sidebar: {
          DEFAULT: "var(--color-base-200)",
          foreground: "var(--color-base-content)",
          primary: "var(--color-primary)",
          "primary-foreground": "var(--color-primary-content)",
          accent: "var(--color-accent)",
          "accent-foreground": "var(--color-accent-content)",
          border: "var(--color-base-300)",
          ring: "var(--color-primary)",
        },
      },
      borderRadius: {
        lg: "var(--radius-box, 0.75rem)",
        md: "var(--radius-field, 0.5rem)",
        sm: "calc(var(--radius-field, 0.5rem) - 2px)",
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
