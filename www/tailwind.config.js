
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
        'loaderincrease': 'increase 2s infinite',
        'loaderdecrease': 'decrease 2s 0.5s infinite',
        'quickfadein': 'fadeIn 0.2s ease-in',
        'delayedfadein': 'delayedFadeIn 2s ease-in-out',
        'delayedthumbnail': 'fadeInOut 2s ease-in-out 3s infinite',
      },
      keyframes: () => ({
        increase: {
          'from': { left: '-5%', width: '5%' },
          'to': { left: '130%', width: '100%' },
        },
        decrease: {
          'from': { left: '-80%', width: '80%' },
          'to': { left: '110%', width: '10%' },
        },
        delayedFadeIn: {
          '0%':   { opacity: '0' },
          '90%':  { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInOut: {
          '0%':   { opacity: '0' },
          '50%':  { opacity: '1' },
          '100%': { opacity: '0' },
        }
        // pulse: {
        //   'from': { transform: scale(1) },
        //   '50%': { transform: scale(0.85) },
        //   'to': { transform: scale(1) }
        // }
      }),
    }
  },
  plugins: [
    // require('@tailwindcss/typography'),
  ],
}
