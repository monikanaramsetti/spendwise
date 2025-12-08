/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        accent: '#7C6FDC',
        // Refined lavender palette
        background: '#efe7ff',
        text: '#1E1E2D',
        success: '#059669',
        danger: '#DC2626',
        secondary: '#8B5CF6',
        lavender: {
          50: '#FAF8FF',
          100: '#F3EFFF',
          200: '#E8DEFF',
          300: '#D4C5F9',
          400: '#B8A4D4',
          500: '#9B7EC7',
          600: '#7E5DB8',
          700: '#6B4BA3',
          800: '#563A85',
          900: '#3D2960',
        },
        indigo: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        purple: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7E22CE',
          800: '#6B21A8',
          900: '#581C87',
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'soft-md': '0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 8px 20px rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.1)',
        'soft-xl': '0 12px 28px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
