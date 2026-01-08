/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // <--- AQUI MUDOU (Antes era só 'tailwindcss')
    autoprefixer: {},
  },
};

export default config;