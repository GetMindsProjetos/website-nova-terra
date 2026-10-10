"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { registerLenis } from "@/lib/scrollLock";

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Rolagem nativa em dispositivos de toque: não carrega Lenis.
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    let cancelled = false;
    let rafId = 0;
    let lenis: Lenis | null = null;

    import("lenis").then(({ default: LenisCtor }) => {
      if (cancelled) return;
      const instance = new LenisCtor({
        duration: 1.1,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
      });
      lenis = instance;
      registerLenis(instance);

      const raf = (time: number) => {
        instance.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      if (lenis) {
        registerLenis(null);
        lenis.destroy();
      }
    };
  }, []);

  return null;
}
