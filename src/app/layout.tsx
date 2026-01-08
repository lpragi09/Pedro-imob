import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
// IMPORTANTE: Importar a Navbar aqui
import { Navbar } from "@/components/Navbar";

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
  description: "Especialistas em venda e aluguel de propriedades rurais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`scroll-smooth ${inter.variable} ${playfair.variable}`}>
      <body className="bg-terras-bege text-terras-marrom antialiased">
        {/* A Navbar fica aqui em cima de tudo */}
        <Navbar />
        
        {children}
      </body>
    </html>
  );
}