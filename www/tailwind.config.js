
const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{ts,tsx}'],
  darkMode: false,
  // darkMode: 'media',
  theme: {
    extend: {
      colors: {
        jncc:    '#2d7a29',
        // https://clrs.cc/
        green:   '#2ECC40',
        blue:    '#0074D9',
        fuchsia: '#F012BE',
      },
      fontFamily: {
        // sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },      
      zIndex: {
        'abovemap': 1001
      },
      height: {
        'loader': '4px'
      },
      animation: {
        'delayedfadein': 'delayedFadeIn 2s ease-in-out',
        'quickfadeout': 'quickFadeOut 1s ease-in-out',
        'increase': 'increase 2s infinite',
        'decrease': 'decrease 2s 0.5s infinite'
      },
      keyframes: () => ({
        delayedFadeIn: {
          '0%':   { opacity: '0' },
          '90%':  { opacity: '0' },
          '100%': { opacity: '1' },
        },
        quickFadeOut: {
          'from': { opacity: '1' },
          'to':   { opacity: '0' },
        },
        increase: {
          'from': { left: '-5%', width: '5%' },
          'to': { left: '130%', width: '100%' },
        },
        decrease: {
          'from': { left: '-80%', width: '80%' },
          'to': { left: '110%', width: '10%' },
        },
      }),
    }
  },
  plugins: [
    // require('@tailwindcss/typography'),
  ],
}
