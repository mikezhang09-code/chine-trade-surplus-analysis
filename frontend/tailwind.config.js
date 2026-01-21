/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ev-blue': '#3B82F6',
        'battery-green': '#10B981',
        'solar-orange': '#F59E0B',
        'traditional-gray': '#6B7280',
      },
    },
  },
  plugins: [],
}
