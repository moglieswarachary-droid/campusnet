/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          blue: '#123B7A',
          'deep-blue': '#0B2550',
          red: '#C62828',
          'bright-red': '#E53935',
          'warm-white': '#F7F3EC',
          'pure-white': '#FFFFFF',
          'soft-blue': '#EAF1FA',
          'slate-text': '#243447',
          'muted-text': '#687586',
          border: '#DCE3EA',
          green: '#198754',
          amber: '#C98A00',
          error: '#B42318',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(36, 52, 71, 0.05), 0 1px 2px rgba(36, 52, 71, 0.03)',
        'warm-md': '0 4px 12px rgba(36, 52, 71, 0.06), 0 2px 4px rgba(36, 52, 71, 0.04)',
        'warm-lg': '0 12px 28px rgba(36, 52, 71, 0.08), 0 4px 10px rgba(36, 52, 71, 0.05)',
        'warm-xl': '0 20px 40px rgba(36, 52, 71, 0.10), 0 6px 16px rgba(36, 52, 71, 0.06)',
        'glow-red': '0 0 20px rgba(198, 40, 40, 0.25)',
        'glow-blue': '0 0 25px rgba(18, 59, 122, 0.25)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
      animation: {
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
