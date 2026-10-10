"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CTAButton from "@/components/CTAButton";

export type HeroSlide = {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  buttons: {
    label: string;
    href: string;
    variant?: "primary" | "secondary" | "ghost";
    external?: boolean;
  }[];
};

const AUTOPLAY_MS = 6500;

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverFocusPaused, setHoverFocusPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(true);
  const [docHidden, setDocHidden] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Pausa a rotação com a aba oculta ou o hero fora da viewport.
  useEffect(() => {
    const onVisibility = () => setDocHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    let observer: IntersectionObserver | null = null;
    const section = sectionRef.current;
    if (section && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => setInView(entry.isIntersecting),
        { threshold: 0.1 }
      );
      observer.observe(section);
    }
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      observer?.disconnect();
    };
  }, []);

  // prefers-reduced-motion com listener (WCAG 2.2.2 / 2.3.3)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + slides.length) % slides.length);
    },
    [slides.length]
  );

  const next = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);
  const prev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);

  // Rotação automática só se o usuário não prefere menos movimento (pausa ao
  // passar o mouse/focar, com a aba oculta ou fora da tela).
  const autoRotation = !reducedMotion && slides.length > 1;

  useEffect(() => {
    if (!autoRotation || hoverFocusPaused || !inView || docHidden) return;
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [autoRotation, hoverFocusPaused, inView, docHidden, next]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      delta > 0 ? prev() : next();
    }
    touchStartX.current = null;
  }

  // Sem botões na tela: as setas do teclado trocam o slide (foco dentro do hero).
  function handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key === "ArrowLeft") prev();
    else if (e.key === "ArrowRight") next();
  }

  function handleBlur(e: React.FocusEvent<HTMLElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setHoverFocusPaused(false);
    }
  }

  return (
    <section
      ref={sectionRef}
      data-header-overlap
      className="relative isolate -mt-[var(--header-h)] h-[100vh] min-h-[560px] overflow-hidden text-night-900 supports-[height:100svh]:h-[100svh]"
      onMouseEnter={() => setHoverFocusPaused(true)}
      onMouseLeave={() => setHoverFocusPaused(false)}
      onFocus={() => setHoverFocusPaused(true)}
      onBlur={handleBlur}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      aria-roledescription="carrossel"
      aria-label="Destaques da Igreja Nova Terra"
    >
      <div
        className="absolute inset-0"
        aria-live={autoRotation ? "off" : "polite"}
        aria-atomic="false"
      >
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          const inertProps = isActive ? {} : ({ inert: "" } as Record<string, string>);
          const Heading = isActive ? "h1" : "h2";
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${slides.length}`}
              aria-hidden={!isActive}
              {...inertProps}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${
                isActive ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div className="relative mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-4 pb-8 pt-[var(--header-h)] text-center sm:px-6">
                {slide.eyebrow && (
                  <p className="text-sm font-semibold uppercase tracking-widest text-night-900">
                    {slide.eyebrow}
                  </p>
                )}
                <Heading className="mt-4 font-serif text-3xl font-medium leading-tight text-night-900 sm:text-5xl">
                  {slide.title}
                </Heading>
                {slide.subtitle && (
                  <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-night-900 sm:text-lg">
                    {slide.subtitle}
                  </p>
                )}
                {slide.buttons.length > 0 && (
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    {slide.buttons.map((btn) => (
                      <CTAButton
                        key={btn.label}
                        href={btn.href}
                        variant={btn.variant ?? "primary"}
                        external={btn.external}
                        className={
                          (btn.variant ?? "primary") === "primary"
                            ? "ring-2 ring-white/80"
                            : ""
                        }
                      >
                        {btn.label}
                      </CTAButton>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
