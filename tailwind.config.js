/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        med: {
          forest: "#166534",
          moss: "#2f855a",
          leaf: "#16a34a",
          earth: "#7c5a3b",
          clay: "#f2ebe2",
          sky: "#0f766e",
          alert: "#dc2626",
          gold: "#ca8a04",
        },
      },
      fontFamily: {
        sans: ["Manrope", "Noto Sans Devanagari", "sans-serif"],
        display: ["Sora", "Noto Sans Devanagari", "sans-serif"],
      },
      boxShadow: {
        panel: "0 20px 60px rgba(17, 24, 39, 0.14)",
        soft: "0 12px 30px rgba(15, 23, 42, 0.08)",
      },
      backgroundImage: {
        "med-hero":
          "radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 30%), linear-gradient(135deg, #14532d 0%, #166534 45%, #0f766e 100%)",
      },
    },
  },
  plugins: [],
};
