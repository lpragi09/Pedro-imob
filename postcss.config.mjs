/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // <--- AQUI MUDOU: Usando o pacote novo da v4
    autoprefixer: {},
  },
};

export default config;