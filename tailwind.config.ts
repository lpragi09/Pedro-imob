import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta "Terras Rurais" extraída da logo
        'terras-marrom': '#4a3426', // Cor do texto e contornos
        'terras-bege': '#f4f1e8',   // Cor do fundo claro
        'terras-verde-musgo': '#6b7a47', // Verde mais escuro da árvore/campo
        'terras-verde-oliva': '#8a9a5b', // Verde mais claro
        'terras-amarelo': '#d9a948', // Amarelo mostarda
        'terras-laranja': '#c17a42', // Laranja queimado (usaremos para destaque/ações)
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair-display)', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;