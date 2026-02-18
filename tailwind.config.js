/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Important for the dark mode toggle to work
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7c3aed", // Violet 600
        secondary: "#db2777", // Pink 600
        "background-light": "#f8fafc", // Slate 50
        "background-dark": "#0f172a", // Slate 900
        "surface-light": "#ffffff",
        "surface-dark": "#1e293b", // Slate 800
        "hero-bg": "#110b29", // Deep purple for hero
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(124, 58, 237, 0.3)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}