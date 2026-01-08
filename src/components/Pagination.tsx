"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  paginaAtual: number;
  totalPaginas: number;
  caminho?: string;
}

export function Pagination({ paginaAtual, totalPaginas, caminho = '/imoveis' }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mudarPagina = (novaPagina: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', novaPagina.toString());
    
    // 1. Muda a URL sem recarregar a página
    router.push(`${caminho}?${params.toString()}`, { scroll: false });

    // 2. Força a rolagem suave até o topo da lista (elemento com id="imoveis")
    const sectionImoveis = document.getElementById('imoveis');
    if (sectionImoveis) {
      sectionImoveis.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Se não achar o ID (caso raro), joga pro topo da página
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (totalPaginas <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-16">
      <button
        onClick={() => mudarPagina(paginaAtual - 1)}
        disabled={paginaAtual === 1}
        className="p-3 border border-terras-marrom/20 rounded-full text-terras-marrom hover:bg-terras-laranja hover:text-terras-bege hover:border-terras-laranja disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-terras-marrom disabled:hover:border-terras-marrom/20 transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <span className="text-sm font-bold text-terras-marrom font-serif">
        Página <span className="text-terras-laranja text-base">{paginaAtual}</span> de {totalPaginas}
      </span>

      <button
        onClick={() => mudarPagina(paginaAtual + 1)}
        disabled={paginaAtual === totalPaginas}
        className="p-3 border border-terras-marrom/20 rounded-full text-terras-marrom hover:bg-terras-laranja hover:text-terras-bege hover:border-terras-laranja disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-terras-marrom disabled:hover:border-terras-marrom/20 transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}