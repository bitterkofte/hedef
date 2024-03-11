/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          750: "#303030"
        },
        emerald: {
          990: "#042813",
          999: "#03200f",
        },
        gold: "#f59e0b",
      }
    },
  },
  plugins: [],
}

