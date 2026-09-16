/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#181b19",
        paper: "#f2f4f1",
        panel: "#ffffff",
        line: "#dfe3de",
        mute: "#6b746c",
        key: "#22b573",
        "key-ink": "#0c3d24",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Inter",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "SFMono-Regular",
          "ui-monospace",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
