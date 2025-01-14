module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'body-text': '#333'
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active', 'disabled'],
      opacity: ['disabled'],
    },
  },
  plugins: [],
};
