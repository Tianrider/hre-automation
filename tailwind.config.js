/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // We'll extend this with corporate branding colors later
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'a4-width': '210mm',
        'a4-height': '297mm',
      },
      margin: {
        'print': '15mm',
      },
    },
  },
  plugins: [],
} 