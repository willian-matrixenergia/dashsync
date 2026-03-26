import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: { DEFAULT: "var(--card)", foreground: "var(--card-foreground)" },
        popover: { DEFAULT: "var(--popover)", foreground: "var(--popover-foreground)" },
        primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
        secondary: { DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)" },
        muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
        accent: { DEFAULT: "var(--accent)", foreground: "var(--accent-foreground)" },
        destructive: { DEFAULT: "var(--destructive)" },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        bgLight: "var(--bg-light)",
        bgDark: "var(--bg-dark)",
        surface: "var(--surface)",
        textMain: "var(--text-main)",
        matrix: {
          dark: "#121212",
          panel: "#1E1E1E",
          orange: "#FF6B00",
          silver: "#E0E0E0",
          muted: "#94A3B8"
        },
        borderColor: "#E2E8F0",
        success: "#22C55E",
        warning: "#EAB308",
        error: "#EF4444",
      },
      fontFamily: {
        display: ["var(--font-lexend)", "Arial", "sans-serif"],
        sans: ["var(--font-lexend)", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
