"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function VideoGallery({ videos }: { videos: string[] }) {
  const [indexAtual, setIndexAtual] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchLocked = useRef(false);

  if (!videos || videos.length === 0) {
    return (
      <div className="h-full w-full bg-slate-200 flex items-center justify-center">
        Sem vídeos
      </div>
    );
  }

  const proximo = () => {
    setIndexAtual((atual) => (atual === videos.length - 1 ? 0 : atual + 1));
  };

  const anterior = () => {
    setIndexAtual((atual) => (atual === 0 ? videos.length - 1 : atual - 1));
  };

  const srcAtual = videos[indexAtual];

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

    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
      touchLocked.current = true;
      return;
    }

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
      e.preventDefault();
    }
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current == null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX.current;

    if (Math.abs(dx) >= 45) {
      if (dx < 0) proximo();
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
      <video
        key={srcAtual}
        src={srcAtual}
        className="w-full h-full object-contain bg-black"
        controls
        preload="metadata"
        playsInline
      />

      {videos.length > 1 ? (
        <>
          <button
            type="button"
            onClick={anterior}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg text-slate-800 opacity-0 group-hover:opacity-100 transition-all"
            aria-label="Vídeo anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={proximo}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg text-slate-800 opacity-0 group-hover:opacity-100 transition-all"
            aria-label="Próximo vídeo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className="bg-black/50 text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              {indexAtual + 1} de {videos.length}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

