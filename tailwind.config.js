const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
     flowbite.content(),],
  theme: {
    extend: {colors: {
      'custom-blue': '#4B9CD3'
    }},
  },
  plugins: [   flowbite.plugin(),],
}