/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        boris: {
          ground: "#1b1d1c",
          back: "#262827",
          border: "#3b3e3c",
          label: "#cfd6d2",
          active: "#e8c97a",
          freeze: "#7ec8e3",
          mute: "#d97a7a",
          led: "#a3e07a",
          contrast: "#f4ead6",
        },
      },
    },
  },
  plugins: [],
};
