/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D5A27', // Forest Green
          dark: '#1d3e18',
          light: '#3f7c38',
        },
        secondary: {
          DEFAULT: '#8B4513', // Earth Brown
        },
        accent: {
          DEFAULT: '#F5F5DC', // Cream/Beige
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
