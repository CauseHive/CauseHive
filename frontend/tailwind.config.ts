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
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#10b981',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#f59e0b',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#64748b',
          foreground: '#374151'
        },
        background: '#f8fafc', // Soft slate background
        foreground: '#0f172a',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#0f172a'
        },
        border: '#e2e8f0',
        input: '#ffffff',
        ring: '#10b981'
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
