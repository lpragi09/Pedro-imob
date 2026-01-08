import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

// Fontes (mantive as mesmas, combinam bem)
const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: '--font-playfair-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Terras Rurais | Imóveis no Campo",
  description: "Especialistas em venda e aluguel de propriedades rurais, sítios e fazendas.",
  icons: {
    icon: "/favicon.ico", // Você pode gerar um favicon novo com a casinha da logo depois!
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`scroll-smooth ${inter.variable} ${playfair.variable}`}>
      {/* AQUI MUDOU: Fundo bege e texto marrom */}
      <body className="bg-terras-bege text-terras-marrom antialiased">
        {children}
      </body>
    </html>
  );
}