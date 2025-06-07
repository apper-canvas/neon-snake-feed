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
        primary: {
          DEFAULT: '#00ffff',
          light: '#66ffff',
          dark: '#00cccc'
        },
        secondary: {
          DEFAULT: '#ff00ff',
          light: '#ff66ff',
          dark: '#cc00cc'
        },
        accent: '#ffff00',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        neon: {
          grid: '#1a1a2e',
          bg: '#0f0f1e',
          success: '#00ff88',
          warning: '#ff9500',
          error: '#ff0055',
          info: '#00aaff'
        }
      },
      fontFamily: { 
        sans: ['Space Mono', 'ui-monospace', 'monospace'], 
        heading: ['Orbitron', 'ui-sans-serif', 'system-ui'],
        display: ['Orbitron', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: { 
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)',
        'neon-cyan': '0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff',
        'neon-magenta': '0 0 20px #ff00ff, 0 0 40px #ff00ff, 0 0 60px #ff00ff',
        'neon-yellow': '0 0 20px #ffff00, 0 0 40px #ffff00, 0 0 60px #ffff00'
      },
      borderRadius: { xl: '0.75rem', '2xl': '1rem' },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite alternate',
        'grid-pulse': 'grid-pulse 1s ease-in-out infinite',
        'score-flash': 'score-flash 0.3s ease-out',
        'food-rotate': 'food-rotate 2s linear infinite'
      },
      keyframes: {
        'pulse-neon': {
          '0%': { 
            'box-shadow': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
            opacity: '0.8'
          },
          '100%': { 
            'box-shadow': '0 0 20px currentColor, 0 0 30px currentColor, 0 0 40px currentColor',
            opacity: '1'
          }
        },
        'grid-pulse': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' }
        },
        'score-flash': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'food-rotate': {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' }
        }
      }
    },
  },
  plugins: [],
}