
module.exports = {
  purge: ['./src/**/*.{ts,tsx}'],
  // darkMode: false,
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        jncc: '#2d7a29',
      }

    }
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
