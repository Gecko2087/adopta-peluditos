/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    darkMode: 'class',
    theme: {
      extend: {
        transitionProperty: {
          height: 'height',
        },
      },
    },
    plugins: [],
  }
  