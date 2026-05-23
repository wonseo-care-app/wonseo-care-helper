import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "#fffaf2",
        ink: "#24312b",
        leaf: "#2f6f5e",
        mint: "#dceee7",
        peach: "#f6c9a8",
        sun: "#f7df8d",
        line: "#e7ded2"
      },
      boxShadow: {
        soft: "0 16px 40px rgba(47, 111, 94, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
