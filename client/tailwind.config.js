/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bjj: {
          primary: '#1e40af', // blå
          secondary: '#dc2626', // röd
          accent: '#f59e0b', // orange/guld
        }
      }
    },
  },
  plugins: [],
}
