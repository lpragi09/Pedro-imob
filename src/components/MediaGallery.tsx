"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type MediaItem =
  | { type: "image"; src: string }
  | { type: "video"; src: string };

export function MediaGallery({
  imagens,
  videos,
}: {
  imagens: string[];
  videos?: string[];
}) {
  const items = useMemo<MediaItem[]>(() => {
    const imgs = (imagens || []).map((src) => ({ type: "image" as const, src }));
    const vids = (videos || []).map((src) => ({ type: "video" as const, src }));
    // Vídeos entram por último, depois de todas as fotos
    return [...imgs, ...vids];
  }, [imagens, videos]);

  const [indexAtual, setIndexAtual] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchLocked = useRef(false);
  const touchDisableSwipe = useRef(false);

  if (!items || items.length === 0) {
    return (
      <div className="h-full w-full bg-slate-200 flex items-center justify-center">
        Sem mídia
      </div>
    );
  }

  const total = items.length;
  const itemAtual = items[Math.min(indexAtual, total - 1)];
  const tipoAtual = itemAtual.type === "image" ? "foto" : "vídeo";
  const tipoAtualPlural = itemAtual.type === "image" ? "fotos" : "vídeos";

  const proximo = () => {
    setIndexAtual((atual) => (atual === total - 1 ? 0 : atual + 1));
  };

  const anterior = () => {
    setIndexAtual((atual) => (atual === 0 ? total - 1 : atual - 1));
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    touchLocked.current = false;
    touchDisableSwipe.current = false;

    // Evita que o swipe atrapalhe o scrub/controles do vídeo no mobile
    if (itemAtual.type === "video") {
      const rect = e.currentTarget.getBoundingClientRect();
      const y = t.clientY - rect.top;
      const alturaControles = 88;
      if (y > rect.height - alturaControles) {
        touchDisableSwipe.current = true;
      }
    }
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchDisableSwipe.current) return;
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
    if (touchDisableSwipe.current) {
      touchStartX.current = null;
      touchStartY.current = null;
      touchLocked.current = false;
      touchDisableSwipe.current = false;
      return;
    }
    if (touchStartX.current == null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX.current;

    // Threshold para trocar (evita trocas acidentais)
    if (Math.abs(dx) >= 45) {
      if (dx < 0) proximo();
      else anterior();
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchLocked.current = false;
    touchDisableSwipe.current = false;
  };

  const srcAtual = itemAtual.src;

  return (
    <div
      className="relative w-full h-full group touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {itemAtual.type === "image" ? (
        <img
          src={srcAtual}
          alt={`Foto ${indexAtual + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
      ) : (
        <video
          key={srcAtual}
          src={srcAtual}
          className="w-full h-full object-contain bg-black"
          controls
          preload="metadata"
          playsInline
        />
      )}

      {total > 1 ? (
        <>
          <button
            type="button"
            onClick={anterior}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg text-slate-800 opacity-0 group-hover:opacity-100 transition-all"
            aria-label="Item anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={proximo}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg text-slate-800 opacity-0 group-hover:opacity-100 transition-all"
            aria-label="Próximo item"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className="bg-black/50 text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              {indexAtual + 1} de {total}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

