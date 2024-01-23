/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFB6C1',
        secondary: '#A7DBF1',
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require('daisyui')], // require does not need to be define since it's part of a 'daisyui'
};
