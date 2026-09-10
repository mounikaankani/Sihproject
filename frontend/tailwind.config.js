/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ndma: {
          dark: '#0B132B',
          navy: '#1C2541',
          surface: '#1E293B',
          border: '#334155',
          accent: '#3A86FF',
          amber: '#F59E0B',
          red: '#EF4444',
          green: '#10B981',
          teal: '#06B6D4'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
