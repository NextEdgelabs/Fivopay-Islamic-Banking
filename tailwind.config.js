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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'accent-blue': 'var(--color-accent-blue)',
        'accent-purple': 'var(--color-accent-purple)',
        'accent-yellow': 'var(--color-accent-yellow)',
        'accent-green': 'var(--color-accent-green)',
        'accent-red': 'var(--color-accent-red)',
        'card-bg': 'var(--color-card-bg)',
        border: 'var(--color-border)',
        'primary-text': 'var(--color-primary-text)',
        'secondary-text': 'var(--color-secondary-text)',
        'disabled-text': 'var(--color-disabled-text)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        btn: 'var(--radius-btn)',
      },
      fontFamily: {
        admin: 'var(--font-admin)',
      },
      spacing: {
        'sidebar': 'var(--sidebar-width)',
      },
    },
  },
  plugins: [],
} 