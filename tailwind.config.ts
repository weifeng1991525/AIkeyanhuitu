import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#E8EDF5',
          100: '#C5D0E6',
          200: '#8BA1CC',
          300: '#5172B3',
          400: '#1E4380',
          500: '#0A1628',
          600: '#091424',
          700: '#07101D',
          800: '#050C16',
          900: '#03080F',
        },
        teal: {
          50: '#E6F7FC',
          100: '#B3E8F7',
          200: '#80D9F2',
          300: '#4DCAED',
          400: '#1ABBEB',
          500: '#0EA5E9',
          600: '#0B94D1',
          700: '#0873A1',
          800: '#055271',
          900: '#033141',
        },
        amber: {
          50: '#FEF9EC',
          100: '#FCECC5',
          200: '#F9DF9E',
          300: '#F6D277',
          400: '#F3C550',
          500: '#F59E0B',
          600: '#D98B09',
          700: '#AD6F07',
          800: '#815305',
          900: '#553703',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern':
          'linear-gradient(135deg, #0A1628 0%, #0B1D3A 50%, #0A1628 100%)',
        'card-shine':
          'linear-gradient(135deg, rgba(14,165,233,0.1) 0%, rgba(245,158,11,0.05) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(14,165,233,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(14,165,233,0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(10, 22, 40, 0.12)',
        'glass-lg': '0 16px 48px rgba(10, 22, 40, 0.18)',
        'neon': '0 0 20px rgba(14, 165, 233, 0.3)',
        'amber-glow': '0 0 20px rgba(245, 158, 11, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
