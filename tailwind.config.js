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
        // 🇭🇹 Couleurs Haiti - Palette Officielle
        'haiti-blue': {
          DEFAULT: '#1e40af',    // Bleu du drapeau (Primary)
          light: '#3b82f6',
          dark: '#1e3a8a',
        },
        'haiti-red': {
          DEFAULT: '#dc2626',    // Rouge du drapeau (Danger)
          light: '#ef4444',
          dark: '#991b1b',
        },
        'haiti-teal': {
          DEFAULT: '#0d9488',    // Turquoise mer des Caraïbes (Secondary) 🌊
          light: '#14b8a6',
          dark: '#0f766e',
        },
        
        // Couleurs système
        'success': {
          DEFAULT: '#10b981',    // Vert
          light: '#34d399',
          dark: '#059669',
        },
        'warning': {
          DEFAULT: '#f59e0b',    // Orange
          light: '#fbbf24',
          dark: '#d97706',
        },
        'info': {
          DEFAULT: '#3b82f6',    // Bleu clair
          light: '#60a5fa',
          dark: '#2563eb',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}