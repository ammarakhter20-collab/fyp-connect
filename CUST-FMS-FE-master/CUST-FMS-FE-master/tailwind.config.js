/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/flowbite/**/*.js"],

  theme: {
    extend: {
      colors: {
        primary: "#514B96",
        secondary: "#F47458",
        gry: "#A3AED0",
        Selected: "#FFFF",
      },
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
        poppins: "Poppins, sans-serif",
        montserrat: "Montserrat",
        DmSans: "DM+Sans",
      },
    },
  },
  plugins: [],
};
