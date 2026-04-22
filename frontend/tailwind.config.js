/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#4f8ef7',
        'primary-glow': '#6aa3ff',
        dark: '#050508',
        'dark-2': '#0d0d14',
        'dark-3': '#13131e',
        'dark-4': '#1a1a28',
        glass: 'rgba(255,255,255,0.04)',
        'glass-border': 'rgba(255,255,255,0.08)',
        'glass-hover': 'rgba(255,255,255,0.07)',
        silver: '#a0a8c0',
        bright: '#e8eaf6',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 40px rgba(79,142,247,0.15)',
        'glow-lg': '0 0 80px rgba(79,142,247,0.2)',
        'card': '0 8px 32px rgba(0,0,0,0.4)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh': 'radial-gradient(at 40% 20%, rgba(79,142,247,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(120,80,255,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(79,142,247,0.08) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
}