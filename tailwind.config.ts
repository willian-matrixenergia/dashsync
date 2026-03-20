import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        bgLight: "var(--bg-light)",
        bgDark: "var(--bg-dark)",
        surface: "var(--surface)",
        textMain: "var(--text-main)",
        muted: "#64748B",
        accentRed: "#DC2626",
        borderColor: "#E2E8F0"
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
