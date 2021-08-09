module.exports = {
  purge: ['./index.html', './src/App.vue', './src/components/*.vue'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
