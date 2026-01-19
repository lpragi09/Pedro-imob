"use client";

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ImageGallery({ imagens }: { imagens: string[] }) {
  const [indexAtual, setIndexAtual] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchLocked = useRef(false);

  // Se não tiver imagem, mostra uma cinza padrão
  if (!imagens || imagens.length === 0) {
    return <div className="h-full w-full bg-slate-200 flex items-center justify-center">Sem imagens</div>;
  }

  const proxima = () => {
    setIndexAtual((atual) => (atual === imagens.length - 1 ? 0 : atual + 1));
  };

  const anterior = () => {
    setIndexAtual((atual) => (atual === 0 ? imagens.length - 1 : atual - 1));
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    touchLocked.current = false;
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current == null || touchStartY.current == null) return;
    if (touchLocked.current) return;

    const t = e.touches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - touchStartY.current;

    // Se o usuário começou a rolar verticalmente, não intercepta
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
      touchLocked.current = true;
      return;
    }

    // Se é claramente horizontal, evita scroll da página
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
      e.preventDefault();
    }
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current == null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX.current;

    // Threshold para trocar (evita trocas acidentais)
    if (Math.abs(dx) >= 45) {
      if (dx < 0) proxima();
      else anterior();
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchLocked.current = false;
  };

  return (
    <div
      className="relative w-full h-full group touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Imagem Principal */}
      <img 
        src={imagens[indexAtual]} 
        alt={`Foto ${indexAtual + 1}`} 
        className="w-full h-full object-cover transition-opacity duration-500"
      />

      {/* Setas (Só aparecem se tiver mais de 1 foto) */}
      {imagens.length > 1 && (
        <>
          <button 
            onClick={anterior}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg text-slate-800 opacity-0 group-hover:opacity-100 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={proxima}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg text-slate-800 opacity-0 group-hover:opacity-100 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicador (Ex: 1 de 2 fotos) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className="bg-black/50 text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              {indexAtual + 1} de {imagens.length} fotos
            </div>
          </div>
        </>
      )}
    </div>
  );
}