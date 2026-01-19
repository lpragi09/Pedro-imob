"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function VideoGallery({ videos }: { videos: string[] }) {
  const [indexAtual, setIndexAtual] = useState(0);

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

  return (
    <div className="relative w-full h-full group">
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

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {videos.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === indexAtual ? "bg-white w-4" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

