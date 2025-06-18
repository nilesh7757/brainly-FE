// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // or wherever your files are
  ],
  safelist: ['w-full', 'text-center', 'max-w-sm'], // <-- add this
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {},
  },
  plugins: [],
}
