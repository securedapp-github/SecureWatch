/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily:{
      sans:['Roboto'],
      inter:['Inter'],
      poppin:['Poppins']
    },
    extend: {}
  },
  plugins: [require("daisyui")]
};

