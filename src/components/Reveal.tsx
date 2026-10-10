"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

/**
 * Revela o conteúdo ao entrar na viewport.
 * Estados: "idle" (SSR/sem JS: visível, sem classe), "armed" (oculto, aguardando
 * a rolagem) e "visible" (animado). Elementos já na dobra no mount ficam em
 * "idle" e nunca piscam; sem IntersectionObserver o conteúdo segue visível.
 */
export default function Reveal({ children, className = "", delay = 0, y = 24 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "armed" | "visible">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) return; // já visível: sem animação

    setState("armed");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties | undefined =
    state === "idle"
      ? undefined
      : {
          transitionDelay: `${delay}ms`,
          ...(state === "armed" ? { transform: `translateY(${y}px)` } : {}),
        };

  const stateClass =
    state === "idle" ? "" : state === "visible" ? "reveal reveal-visible" : "reveal";

  return (
    <div ref={ref} className={`${stateClass} ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
