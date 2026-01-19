"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  /** "up" dá a sensação de subir; "none" só faz fade */
  direction?: "up" | "none";
  /** Intensidade do deslocamento (px) quando direction="up" */
  distance?: number;
  /** Duração da animação em ms */
  durationMs?: number;
  /** Delay em ms (bom pra criar stagger em grids) */
  delayMs?: number;
  /** Se true, anima apenas uma vez (comportamento antigo). Se false, anima sempre que entrar/sair da viewport. */
  once?: boolean;
  /** Quanto do elemento precisa aparecer (0 a 1) */
  threshold?: number;
  /** Margem do observer (ex: "0px 0px -10% 0px") */
  rootMargin?: string;
  className?: string;
};

function join(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function Reveal({
  children,
  direction = "up",
  distance = 14,
  durationMs = 650,
  delayMs = 0,
  once = false,
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setShown(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) obs.disconnect();
            break;
          } else if (!once) {
            // Modo contínuo: ao sair da viewport, reseta para poder animar de novo
            setShown(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [once, prefersReducedMotion, rootMargin, threshold]);

  const translate = direction === "up" ? `translate3d(0, ${distance}px, 0)` : "translate3d(0, 0, 0)";

  return (
    <div
      ref={ref}
      className={join(className)}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translate3d(0, 0, 0)" : translate,
        transitionProperty: "opacity, transform",
        transitionDuration: `${durationMs}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: `${delayMs}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

