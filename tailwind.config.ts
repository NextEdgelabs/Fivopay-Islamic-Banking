import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stripe-inspired color palette
        primary: {
          50: '#F6F9FC',
          100: '#E3E8EF',
          200: '#C7D0DD',
          300: '#A3ACBA',
          400: '#697386',
          500: '#635BFF', // Main Stripe purple/blue
          600: '#5849CC',
          700: '#4B3FB8',
          800: '#0A2540', // Dark blue
          900: '#0A1929',
        },
        success: {
          50: '#E6F9ED',
          100: '#C0F0D4',
          200: '#9AE7BA',
          300: '#74DEA1',
          400: '#4ED587',
          500: '#00D924', // Stripe green
          600: '#00B51E',
          700: '#009118',
          800: '#006D12',
          900: '#00490C',
        },
        warning: {
          50: '#FFF8E6',
          100: '#FFEDC0',
          200: '#FFE199',
          300: '#FFD673',
          400: '#FFCA4D',
          500: '#FFA500', // Orange
          600: '#E68A00',
          700: '#CC7A00',
          800: '#B36900',
          900: '#995900',
        },
        error: {
          50: '#FEE7EC',
          100: '#FCC4D0',
          200: '#FA9FB3',
          300: '#F87A97',
          400: '#F6557A',
          500: '#DF1B41', // Stripe red
          600: '#C31838',
          700: '#A7142F',
          800: '#8B1126',
          900: '#6F0D1D',
        },
        neutral: {
          50: '#F6F9FC',
          100: '#E3E8EF',
          200: '#D1D8E0',
          300: '#A3ACBA',
          400: '#697386',
          500: '#4E5D78',
          600: '#3C4A5F',
          700: '#2A3747',
          800: '#1A2332',
          900: '#0A1929',
        },
        background: {
          primary: '#FFFFFF',
          secondary: '#F6F9FC',
          tertiary: '#E3E8EF',
        },
        border: {
          light: '#E3E8EF',
          DEFAULT: '#C7D0DD',
          dark: '#A3ACBA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Roboto Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.875rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'DEFAULT': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'md': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'lg': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'stripe': '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
        'stripe-lg': '0 13px 27px -5px rgba(50, 50, 93, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        'stripe': '6px',
        'stripe-lg': '8px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

export default config;
