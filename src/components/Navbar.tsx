"use client";

import { useState } from 'react';
import { Home, Menu, Phone, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname(); // Sabe em qual página você está
  const router = useRouter();     // Serve para trocar de página

  // Função inteligente de navegação
  const handleNavigation = (id: string) => {
    setMenuAberto(false); // Fecha o menu mobile primeiro

    if (pathname === '/') {
      // CENÁRIO 1: Você já está na Home
      // O comportamento é apenas rolar suavemente até a seção
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // CENÁRIO 2: Você está na página de Detalhes do Imóvel (ou Admin)
      // O comportamento é forçar a ida para a Home mirando na seção (#id)
      router.push(`/#${id}`);
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO - Sempre leva para o topo */}
        <button onClick={() => handleNavigation('topo')} className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Home className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-blue-900 tracking-tight">
            Imob<span className="text-blue-600">Prime</span>
          </span>
        </button>

        {/* LINKS DESKTOP */}
        <div className="hidden md:flex gap-8 font-medium text-slate-600 text-sm">
          <button onClick={() => handleNavigation('topo')} className="hover:text-blue-600 transition">Início</button>
          <button onClick={() => handleNavigation('imoveis')} className="hover:text-blue-600 transition">Imóveis</button>
          <button onClick={() => handleNavigation('sobre')} className="hover:text-blue-600 transition">Sobre Nós</button>
          <button onClick={() => handleNavigation('contato')} className="hover:text-blue-600 transition">Contato</button>
        </div>

        {/* BOTÃO WHATSAPP E MENU MOBILE */}
        <div className="flex items-center gap-4">
          <a 
            href="https://wa.me/5511999999999?text=Olá,%20vim%20pelo%20site!" 
            target="_blank"
            className="hidden md:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full font-bold text-sm transition shadow-lg shadow-green-900/10"
          >
            <Phone className="w-4 h-4" /> WhatsApp
          </a>

          {/* Botão Hambúrguer Mobile */}
          <button 
            onClick={() => setMenuAberto(!menuAberto)} 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            {menuAberto ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE (Abre quando clica no hambúrguer) */}
      {menuAberto && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full left-0 p-4 shadow-xl flex flex-col gap-4 animate-in slide-in-from-top-5">
          <button onClick={() => handleNavigation('topo')} className="text-left p-2 font-medium text-slate-600 hover:bg-slate-50 rounded">Início</button>
          <button onClick={() => handleNavigation('imoveis')} className="text-left p-2 font-medium text-slate-600 hover:bg-slate-50 rounded">Imóveis</button>
          <button onClick={() => handleNavigation('sobre')} className="text-left p-2 font-medium text-slate-600 hover:bg-slate-50 rounded">Sobre Nós</button>
          <button onClick={() => handleNavigation('contato')} className="text-left p-2 font-medium text-slate-600 hover:bg-slate-50 rounded">Contato</button>
          
          <a href="https://wa.me/5511999999999" target="_blank" className="bg-green-500 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2">
            <Phone className="w-4 h-4" /> Falar no WhatsApp
          </a>
        </div>
      )}
    </nav>
  );
}