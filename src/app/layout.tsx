import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

// Fonte moderna para textos
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
// Fonte clássica para títulos
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "ImobPrime | Realizando Sonhos!",
  description: "Imóveis de alto padrão.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      {/* Adicionamos as variaveis de fonte e o fundo escuro aqui */}
      <body className={`${inter.variable} ${playfair.variable} bg-slate-950 text-slate-200 font-sans`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}