"use client";

import { useState, useEffect } from 'react';
import { Menu, Phone, X, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Efeito para mudar a cor quando rola a pagina
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'glass-nav py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO DE LUXO */}
        <button onClick={() => handleNavigation('topo')} className="text-2xl font-serif font-bold text-white tracking-widest uppercase">
          Imob<span className="text-yellow-500">Prime</span>
        </button>

        {/* LINKS DESKTOP */}
        <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
          <button onClick={() => handleNavigation('imoveis')} className="hover:text-yellow-500 transition">Acervo</button>
          <button onClick={() => handleNavigation('sobre')} className="hover:text-yellow-500 transition">A Marca</button>
          <button onClick={() => handleNavigation('contato')} className="hover:text-yellow-500 transition">Contato</button>
        </div>

        {/* CONTATO */}
        <div className="flex items-center gap-4">
          <a 
            href="https://wa.me/5511999999999" 
            target="_blank"
            className={`hidden md:flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition border ${scrolled ? 'border-white/20 text-white hover:bg-white hover:text-black' : 'border-white text-white hover:bg-white hover:text-black'}`}
          >
            <Phone className="w-3 h-3" /> Fale Conosco
          </a>

          <button onClick={() => setMenuAberto(!menuAberto)} className="md:hidden text-white hover:text-yellow-500 transition">
            {menuAberto ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      {menuAberto && (
        <div className="md:hidden bg-slate-950 absolute w-full left-0 border-b border-white/10 p-6 flex flex-col gap-6 animate-in slide-in-from-top-5">
          <button onClick={() => handleNavigation('imoveis')} className="text-left text-white font-serif text-xl">Acervo</button>
          <button onClick={() => handleNavigation('sobre')} className="text-left text-white font-serif text-xl">A Marca</button>
          <button onClick={() => handleNavigation('contato')} className="text-left text-white font-serif text-xl">Contato</button>
        </div>
      )}
    </nav>
  );
}