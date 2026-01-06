/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB', // Royal Blue
        background: '#F8FAFC', // Slate Gray
        text: '#1E293B', // Dark Slate
      },
    },
  },
  plugins: [],
}
