/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core palette — inspired by zellige tilework and desert dusk,
        // deliberately away from the generic "warm cream + terracotta" AI default.
        ink: "#1A2E2A",          // near-black with a green-teal undertone, for text
        majorelle: "#28527A",    // deep indigo-teal, primary brand color
        majorelleDeep: "#173247",
        saffron: "#E2A33B",      // warm accent, used sparingly (CTAs, highlights)
        sand: "#F1E7D3",         // warm background
        clay: "#B0522D",         // secondary accent, doors/pottery clay
        mint: "#7FA99B",         // muted zellige green, for subtle dividers/success states
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        arabic: ["'Noto Kufi Arabic'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
