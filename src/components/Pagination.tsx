"use client";

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  paginaAtual: number;
  totalPaginas: number;
}

export function Pagination({ paginaAtual, totalPaginas }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname(); // <--- O SEGREDO: Pega a página atual automaticamente

  const irParaPagina = (pagina: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pagina.toString());
    
    // Agora ele redireciona para a mesma página onde você está (pathname)
    router.push(`${pathname}?${params.toString()}`, { scroll: false }); 
  };

  if (totalPaginas <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <button
        disabled={paginaAtual === 1}
        onClick={() => irParaPagina(paginaAtual - 1)}
        className="p-2 rounded-sm bg-slate-900 border border-slate-800 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:border-yellow-600 hover:text-white transition"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          onClick={() => irParaPagina(num)}
          className={`w-10 h-10 rounded-sm font-bold text-sm border transition ${
            paginaAtual === num
              ? 'bg-yellow-600 border-yellow-600 text-black'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'
          }`}
        >
          {num}
        </button>
      ))}

      <button
        disabled={paginaAtual === totalPaginas}
        onClick={() => irParaPagina(paginaAtual + 1)}
        className="p-2 rounded-sm bg-slate-900 border border-slate-800 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:border-yellow-600 hover:text-white transition"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}