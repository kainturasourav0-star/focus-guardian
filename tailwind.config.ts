import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary palette
        brand: {
          purple: '#7c3aed',
          'purple-light': '#9f67ff',
          'purple-dark': '#5b21b6',
          cyan: '#06b6d4',
          'cyan-light': '#22d3ee',
          'cyan-dark': '#0891b2',
        },
        // Background layers
        dark: {
          50: '#1e1e2e',
          100: '#181824',
          200: '#111118',
          300: '#0d0d14',
          400: '#0a0a0f',
          500: '#070710',
        },
        // Status colors
        productive: '#10b981',
        distraction: '#ef4444',
        neutral: '#f59e0b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-focus': 'linear-gradient(135deg, #7c3aed, #06b6d4)',
        'gradient-card': 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.1))',
        'gradient-productive': 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.1))',
        'gradient-distraction': 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(245,158,11,0.1))',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '40px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(124,58,237,0.5), 0 0 20px rgba(124,58,237,0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(124,58,237,0.8), 0 0 60px rgba(124,58,237,0.3)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glass': '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        'glass-hover': '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
        'purple-glow': '0 0 40px rgba(124,58,237,0.3)',
        'cyan-glow': '0 0 40px rgba(6,182,212,0.3)',
        'card': '0 2px 8px rgba(0,0,0,0.3)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}

export default config
