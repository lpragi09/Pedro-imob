"use client";

import { useState, useEffect } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Detecta rolagem para mudar a cor da navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (id: string) => {
    setMenuAberto(false);
    if (pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/#${id}`);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-slate-900/90 backdrop-blur-md py-4 shadow-xl' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO Minimalista */}
        <button onClick={() => handleNavigation('topo')} className="text-2xl font-bold text-white tracking-widest uppercase font-serif">
          Imob<span className="text-yellow-500">Prime</span>
        </button>

        {/* LINKS (Texto branco) */}
        <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-slate-300">
          <button onClick={() => handleNavigation('imoveis')} className="hover:text-white transition">Acervo</button>
          <button onClick={() => handleNavigation('sobre')} className="hover:text-white transition">Sobre</button>
          <button onClick={() => handleNavigation('contato')} className="hover:text-white transition">Contato</button>
        </div>

        <div className="flex items-center gap-4">
          <a href="https://wa.me/5511999999999" target="_blank" className={`hidden md:flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition ${scrolled ? 'bg-white text-slate-900' : 'glass text-white hover:bg-white hover:text-slate-900'}`}>
            <Phone className="w-3 h-3" /> Fale Conosco
          </a>
          <button onClick={() => setMenuAberto(!menuAberto)} className="md:hidden text-white">
            {menuAberto ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      
      {/* Menu Mobile Dark */}
      {menuAberto && (
        <div className="md:hidden bg-slate-900 absolute w-full left-0 p-6 flex flex-col gap-6 border-b border-slate-800">
          <button onClick={() => handleNavigation('imoveis')} className="text-white text-lg font-serif">Acervo</button>
          <button onClick={() => handleNavigation('sobre')} className="text-white text-lg font-serif">Sobre</button>
        </div>
      )}
    </nav>
  );
}