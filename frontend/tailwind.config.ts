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
        background: '#ffffff',
        foreground: '#111827',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#111827'
        },
        border: '#e5e7eb',
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
