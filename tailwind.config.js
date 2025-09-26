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
        background: '#F8F9FA', // Light Gray
        primary: '#0052CC', // Vivid Blue
        'primary-dark': '#0041A3',
        secondary: '#E9ECEF', // Lighter Gray
        'secondary-dark': '#DEE2E6',
        accent: '#007BFF', // Bright Blue
        'accent-dark': '#0069D9',
        danger: '#DC3545', // Strong Red
        'danger-dark': '#C82333',
        warning: '#FFC107', // Bright Yellow
        'warning-dark': '#E0A800',
        info: '#17A2B8', // Teal
        'info-dark': '#138496',
        light: '#FFFFFF',
        dark: '#343A40', // Dark Gray
        'dark-light': '#6C757D',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'xl': '1rem',
      }
    },
  },
  plugins: [],
}

