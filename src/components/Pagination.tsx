"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  paginaAtual: number;
  totalPaginas: number;
  caminho?: string; // Novo parâmetro opcional (padrão será '/imoveis')
}

export function Pagination({ paginaAtual, totalPaginas, caminho = '/imoveis' }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mudarPagina = (novaPagina: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', novaPagina.toString());
    
    // Agora ele usa o caminho que a gente mandou, não mais fixo
    router.push(`${caminho}?${params.toString()}`);
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