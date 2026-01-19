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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (els.length === 0) return;

    // Define um estado inicial razoável (evita ficar "preso" em / sem hash quando já está no meio da página).
    const initialHash = window.location.hash?.replace("#", "");
    lastHashRef.current = initialHash || "";

    // RootMargin escolhido para trocar o hash quando a seção cruza uma "linha" central da viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        // Pega a entrada mais "forte" (maior intersectionRatio) que esteja intersectando
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (!visible?.target) return;

        const id = (visible.target as HTMLElement).id;
        if (!id) return;

        // Não atualiza se já estiver no mesmo hash
        if (lastHashRef.current === id) return;

        lastHashRef.current = id;
        const newUrl = `${window.location.pathname}${window.location.search}#${id}`;
        window.history.replaceState(null, "", newUrl);
      },
      {
        threshold: [0.18, 0.25, 0.35, 0.5, 0.65],
        rootMargin: "-35% 0px -55% 0px",
      }
    );

    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sectionIds]);

  return null;
}

