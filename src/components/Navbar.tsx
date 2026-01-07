import { Home, Menu, Phone } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Home className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-blue-900 tracking-tight">
            Imob<span className="text-blue-600">Prime</span>
          </span>
        </Link>

        {/* LINKS CENTRAIS */}
        <div className="hidden md:flex gap-8 font-medium text-slate-600 text-sm">
          <Link href="/" className="hover:text-blue-600 transition">Início</Link>
          <a href="#destaques" className="hover:text-blue-600 transition">Imóveis</a>
          <a href="#" className="hover:text-blue-600 transition">Sobre Nós</a>
          <a href="#" className="hover:text-blue-600 transition">Contato</a>
        </div>

        {/* BOTÃO DE CONTATO (No lugar de Login) */}
        <div className="flex items-center gap-4">
          <a 
            href="https://wa.me/5500000000000" // Link do WhatsApp
            className="hidden md:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full font-bold text-sm transition shadow-lg shadow-green-900/10"
          >
            <Phone className="w-4 h-4" /> Fale Conosco
          </a>
          <button className="md:hidden p-2 text-slate-600">
            <Menu />
          </button>
        </div>
      </div>
    </header>
  );
}