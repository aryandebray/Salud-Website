/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#B4A186",
        secondary: "#8B7355",
        accent: "#F5F1EA",
        brand: "#0B4D2C",
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-playfair-display)'],
      },
    },
  },
  plugins: [],
}; 