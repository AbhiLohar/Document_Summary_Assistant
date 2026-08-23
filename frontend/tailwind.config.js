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
        brand: {
          50: '#f4f6ff',
          100: '#e9edfe',
          200: '#d7e0fd',
          300: '#b8c9fb',
          400: '#8ea6f8',
          500: '#647ef4',
          600: '#4f62ea',
          700: '#3f4dd4',
          800: '#3540ac',
          900: '#2f3888',
          950: '#1d2254',
        },
        violetAccent: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        surface: {
          50: '#f8f9fc',
          100: '#f1f3f9',
          200: '#e2e6f0',
          300: '#cbd2e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#070b14',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 20px 35px -10px rgba(79, 98, 234, 0.12), 0 8px 16px -6px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(79, 98, 234, 0.2)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'card-dark-hover': '0 20px 40px -12px rgba(99, 102, 241, 0.25), 0 0 0 1px rgba(129, 140, 248, 0.3)',
        'elevated': '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
        'glow-brand': '0 0 30px rgba(79, 98, 234, 0.25)',
        'glow-violet': '0 0 30px rgba(139, 92, 246, 0.25)',
      },
      animation: {
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'float-medium': 'floatSlow 4s ease-in-out infinite',
        'scanline': 'scanline 2.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(0.8deg)' },
        },
        scanline: {
          '0%': { transform: 'translateY(0%)', opacity: '0.8' },
          '50%': { transform: 'translateY(100%)', opacity: '1' },
          '100%': { transform: 'translateY(0%)', opacity: '0.8' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.04)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
