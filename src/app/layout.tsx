import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar"; // Importando a nova Navbar

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ImobPrime - Sua Imobiliária",
  description: "Encontre o imóvel dos seus sonhos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Navbar /> {/* Ela vai aparecer em cima de todas as páginas */}
        {children}
      </body>
    </html>
  );
}