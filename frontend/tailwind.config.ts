import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981',
          foreground: '#052e1a',
        },
        secondary: {
          DEFAULT: '#1e40af',
          foreground: '#0b1739',
        },
        accent: {
          DEFAULT: '#f59e0b',
          foreground: '#7a3f00',
        },
        muted: '#64748b',
        background: '#0b0f14',
        card: '#0f172a',
        border: '#1f2937'
      },
      borderRadius: {
        lg: '0.8rem',
        md: '0.6rem',
        sm: '0.4rem',
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0,0,0,0.06)',
        card: '0 4px 20px rgba(0,0,0,0.1)'
      }
    },
  },
  plugins: [animate]
} satisfies Config
