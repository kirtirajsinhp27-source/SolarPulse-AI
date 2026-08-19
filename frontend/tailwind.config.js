/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mist: {
          50: '#F1F5F9',
          100: '#E2E8F0',
          200: '#94A3B8',
          300: '#64748B',
          DEFAULT: '#475569',
          dark: '#334155',
        },
      },
    },
  },
  plugins: [],
}
