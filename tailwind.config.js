/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
      },
      colors: {
        forest: {
          50: '#f1f4ef',
          100: '#eef0ec', // Creamy white
          200: '#dce2d7',
          300: '#c2d1ba',
          400: '#9fbda0', // Sage accent
          500: '#7a9b7b',
          600: '#5c7a5d',
          700: '#4a624b', 
          800: '#2c3a2d', // Borders
          900: '#131b17', // Cards
          950: '#0a0f0d', // Background
        }
      }
    },
  },
  plugins: [],
}
