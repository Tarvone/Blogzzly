module.exports = {
  content: [
    './templates/**/*.html',
    './static/**/*.js',
  ],
  safelist: [
    {
      pattern: /bg-(gray|red|blue|green|yellow|purple|pink|indigo|amber|rose|teal|cyan|lime|fuchsia|emerald)-900/,
    },
    {
      pattern: /text-(gray|red|blue|green|yellow|purple|pink|indigo|amber|rose|teal|cyan|lime|fuchsia|emerald)-100/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}