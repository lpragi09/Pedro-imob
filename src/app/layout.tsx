import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google"; // Importando a fonte nova
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "ImobPrime | Exclusive Real Estate",
  description: "Imóveis de alto padrão.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-slate-900`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}