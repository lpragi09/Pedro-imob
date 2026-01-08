"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, MessageCircle } from 'lucide-react';

export function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <nav className="bg-terras-marrom text-terras-bege border-b border-terras-bege/10 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO */}
          <Link href="/" className="text-2xl font-serif font-bold flex items-center gap-2 group">
            <div className="bg-terras-bege/10 p-2 rounded-lg group-hover:bg-terras-laranja transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-terras-bege">
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
              </svg>
            </div>
            <div>
              <span className="text-terras-amarelo">Terras</span>Rurais
            </div>
          </Link>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
            <Link href="/" className="hover:text-terras-laranja transition">Início</Link>
            <Link href="/#imoveis" className="hover:text-terras-laranja transition">Propriedades</Link>
            <Link href="/#sobre" className="hover:text-terras-laranja transition">Quem Somos</Link>
            <Link href="/#contato" className="hover:text-terras-laranja transition">Contato</Link>
          </div>

          {/* WHATSAPP DESKTOP */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="https://wa.me/5511999999999" 
              target="_blank"
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2 rounded font-bold text-xs uppercase tracking-widest shadow-lg transition flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4"/> WhatsApp
            </a>
          </div>

          {/* BOTAO MOBILE */}
          <button 
            className="md:hidden text-terras-bege p-2 z-50" 
            onClick={() => setMenuAberto(!menuAberto)}
          >
            {menuAberto ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      {menuAberto && (
        <div className="fixed inset-0 top-20 bg-[#3a281d] z-40 flex flex-col p-8 gap-8 animate-in slide-in-from-right">
          <Link 
            href="/" 
            onClick={() => setMenuAberto(false)} 
            className="text-terras-bege text-xl font-bold uppercase tracking-widest border-b border-terras-bege/10 pb-4"
          >
            Início
          </Link>
          <Link 
            href="/#imoveis" 
            onClick={() => setMenuAberto(false)} 
            className="text-terras-bege text-xl font-bold uppercase tracking-widest border-b border-terras-bege/10 pb-4"
          >
            Propriedades
          </Link>
          <Link 
            href="/#sobre" 
            onClick={() => setMenuAberto(false)} 
            className="text-terras-bege text-xl font-bold uppercase tracking-widest border-b border-terras-bege/10 pb-4"
          >
            Quem Somos
          </Link>
          <Link 
            href="/#contato" 
            onClick={() => setMenuAberto(false)} 
            className="text-terras-bege text-xl font-bold uppercase tracking-widest border-b border-terras-bege/10 pb-4"
          >
            Contato
          </Link>
          
          <a 
            href="https://wa.me/5511999999999" 
            target="_blank"
            className="bg-[#25D366] text-white font-bold py-4 rounded-lg uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" /> WhatsApp
          </a>
        </div>
      )}
    </nav>
  );
}