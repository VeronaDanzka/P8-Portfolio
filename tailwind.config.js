/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
    safelist: [
      'list-disc',
      'pl-5'
    ],
    darkMode: "class", // Active le mode sombre basé sur une classe
    theme: {
      extend: {
        backgroundImage: {
            'gradient-dark': 'linear-gradient(137deg, rgba(27,24,79,1) 26%, rgba(0,212,255,1) 72%)',
          },
      },
    },
    plugins: [],
  };
  