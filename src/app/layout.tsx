import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
// 1. O import deve ficar aqui no topo
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

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

        {/* 2. O componente deve ser chamado como uma tag HTML aqui */}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}