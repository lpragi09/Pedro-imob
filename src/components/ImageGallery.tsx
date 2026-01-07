"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ImageGallery({ imagens }: { imagens: string[] }) {
  const [indexAtual, setIndexAtual] = useState(0);

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

  return (
    <div className="relative w-full h-full group">
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

          {/* Bolinhas indicadoras */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {imagens.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full transition-all ${idx === indexAtual ? 'bg-white w-4' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}