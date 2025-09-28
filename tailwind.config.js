/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Stripe Design System Colors
        stripe: {
          primary: '#635BFF',
          'primary-dark': '#4C44DB',
          'primary-light': '#7C7CFF',
          background: '#FAFBFC',
          surface: '#FFFFFF',
          border: '#E3E8EE',
          'border-light': '#F6F9FC',
          text: '#0A2540',
          'text-secondary': '#425A72',
          'text-muted': '#8898AA',
          success: '#00D924',
          'success-light': '#E6F9E6',
          warning: '#FF9500',
          'warning-light': '#FFF4E6',
          error: '#FA755A',
          'error-light': '#FFEEE6',
          info: '#635BFF',
          'info-light': '#F0F0FF',
        },
        // Legacy color mapping for compatibility
        background: '#FAFBFC', // Stripe background
        primary: '#635BFF', // Stripe primary
        'primary-dark': '#4C44DB',
        secondary: '#E3E8EE', // Stripe border
        'secondary-dark': '#D1D8E0',
        accent: '#635BFF', // Stripe primary
        'accent-dark': '#4C44DB',
        danger: '#FA755A', // Stripe error
        'danger-dark': '#E8442E',
        warning: '#FF9500', // Stripe warning
        'warning-dark': '#E8850A',
        info: '#635BFF', // Stripe primary
        'info-dark': '#4C44DB',
        light: '#FFFFFF',
        dark: '#0A2540', // Stripe text
        'dark-light': '#425A72',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Cascadia Code', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'stripe': '6px',
        'stripe-sm': '4px',
        'stripe-lg': '8px',
        'xl': '1rem',
      },
      boxShadow: {
        'stripe-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'stripe': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'stripe-lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'stripe-xl': '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}

