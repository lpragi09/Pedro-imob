"use client";

import { useEffect, useRef } from "react";

type SectionId = "topo" | "imoveis" | "sobre" | "contato";

type ScrollHashSyncProps = {
  /**
   * Ordem importa: em caso de empate, a primeira seção da lista prevalece.
   */
  sectionIds?: SectionId[];
};

/**
 * Atualiza o hash da URL conforme o usuário rola a página, sem recarregar e sem "pular" o scroll.
 * Ex.: ao entrar na seção #imoveis, a URL vira /#imoveis automaticamente.
 */
export function ScrollHashSync({
  sectionIds = ["topo", "imoveis", "sobre", "contato"],
}: ScrollHashSyncProps) {
  const lastHashRef = useRef<string>("");
  const ratiosRef = useRef<Record<string, number>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (els.length === 0) return;

    // Define um estado inicial razoável (evita ficar "preso" em / sem hash quando já está no meio da página).
    const initialHash = window.location.hash?.replace("#", "");
    lastHashRef.current = initialHash || "";
    ratiosRef.current = Object.fromEntries(sectionIds.map((id) => [id, 0]));

    // RootMargin escolhido para trocar o hash quando a seção cruza uma "linha" central da viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        // Atualiza o "estado" de todas as seções (não só das entries do callback),
        // porque o browser pode notificar apenas o elemento que saiu/entrou.
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (!id) continue;
          ratiosRef.current[id] = entry.isIntersecting ? entry.intersectionRatio : 0;
        }

        // Decide qual seção está "ativa" (a com maior presença na viewport).
        let bestId: string | null = null;
        let bestRatio = 0;
        for (const id of sectionIds) {
          const ratio = ratiosRef.current[id] ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (!bestId) return;

        // Não atualiza se já estiver no mesmo hash
        if (lastHashRef.current === bestId) return;

        lastHashRef.current = bestId;
        const newUrl = `${window.location.pathname}${window.location.search}#${bestId}`;
        window.history.replaceState(null, "", newUrl);
      },
      {
        threshold: [0, 0.15, 0.25, 0.35, 0.5, 0.65, 0.8],
        // Margem mais tolerante para disparar em diferentes alturas/tamanhos de tela
        rootMargin: "-25% 0px -55% 0px",
      }
    );

    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sectionIds]);

  return null;
}

