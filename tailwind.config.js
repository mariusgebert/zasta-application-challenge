/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: '#e2e2e2',
        background: '#f1f1f1',
      },
    },
  },
  plugins: [],
};
