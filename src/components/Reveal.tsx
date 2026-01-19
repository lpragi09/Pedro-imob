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
  // Começa como "true" para não esconder conteúdo no SSR/hidratação (evita sensação de “teleporte”).
  // No mount, calculamos se está em viewport para decidir se deve iniciar oculto (abaixo da dobra).
  const [shown, setShown] = useState(true);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(max-width: 768px)")?.matches ?? false;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setShown(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    // Decide o estado inicial com base na viewport (sem piscar).
    // Se já estiver visível, mantém mostrado; se estiver fora da tela, inicia oculto para animar quando entrar.
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    setShown(inView);

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) obs.disconnect();
            break;
          } else if (!once && entry.intersectionRatio === 0) {
            // Modo contínuo: só reseta quando saiu COMPLETAMENTE da viewport (evita flicker no mobile)
            setShown(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [once, prefersReducedMotion, rootMargin, threshold]);

  // Mobile: animação mais “lisa” (menos deslocamento, mais duração e um leve delay padrão).
  const effectiveDistance = isMobile ? Math.min(distance, 10) : distance;
  const effectiveDurationMs = isMobile ? Math.max(durationMs, 780) : durationMs;
  const effectiveDelayMs = isMobile ? delayMs + 60 : delayMs;

  const translate =
    direction === "up"
      ? `translate3d(0, ${effectiveDistance}px, 0)`
      : "translate3d(0, 0, 0)";

  return (
    <div
      ref={ref}
      className={join(className)}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translate3d(0, 0, 0)" : translate,
        transitionProperty: "opacity, transform",
        transitionDuration: `${effectiveDurationMs}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: `${effectiveDelayMs}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

