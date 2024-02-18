/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    fontFamily:{
      sans:['Roboto']
    },
    extend: {}
  },
  plugins: [require("daisyui")]
};