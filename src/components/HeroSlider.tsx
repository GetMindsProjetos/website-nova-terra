"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CTAButton from "@/components/CTAButton";
import MeshBackground from "@/components/MeshBackground";

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

const controlBase =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/60 text-night-900 transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-900";

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
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

  // Rotação automática só se o usuário não pausou e não prefere menos movimento.
  const autoRotation = !userPaused && !reducedMotion && slides.length > 1;

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

  function handleBlur(e: React.FocusEvent<HTMLElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setHoverFocusPaused(false);
    }
  }

  const multiple = slides.length > 1;

  return (
    <section
      ref={sectionRef}
      className="relative isolate h-[560px] overflow-hidden border-b border-terra-100 text-night-900 sm:h-[640px] lg:h-[680px]"
      onMouseEnter={() => setHoverFocusPaused(true)}
      onMouseLeave={() => setHoverFocusPaused(false)}
      onFocus={() => setHoverFocusPaused(true)}
      onBlur={handleBlur}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carrossel"
      aria-label="Destaques da Igreja Nova Terra"
    >
      <MeshBackground className="-z-10" />

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
              <div className="relative mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-4 pb-16 text-center sm:px-6">
                {slide.eyebrow && (
                  <p className="text-sm font-semibold uppercase tracking-widest text-night-900">
                    {slide.eyebrow}
                  </p>
                )}
                <Heading className="mt-4 font-serif text-3xl font-bold leading-tight text-night-900 sm:text-5xl">
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

      {multiple && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Slide anterior"
            className={`${controlBase} absolute left-5 top-1/2 z-10 hidden -translate-y-1/2 sm:flex`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Próximo slide"
            className={`${controlBase} absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 sm:flex`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2" aria-hidden="true">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center px-2">
            <div className="flex max-w-full flex-wrap items-center justify-center gap-1 rounded-full bg-white/60 p-1">
              <button
                type="button"
                onClick={prev}
                aria-label="Slide anterior"
                className={`${controlBase} sm:hidden`}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={
                  userPaused ? "Retomar rotação automática" : "Pausar rotação automática"
                }
                aria-pressed={userPaused}
                className={controlBase}
              >
                {userPaused || reducedMotion ? (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                  </svg>
                )}
              </button>
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Ir para o slide ${index + 1} de ${slides.length}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  className="group flex h-11 min-w-[2.75rem] items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-900"
                >
                  <span
                    aria-hidden="true"
                    className={`block h-2 rounded-full transition-all motion-reduce:transition-none ${
                      index === activeIndex
                        ? "w-6 bg-night-900"
                        : "w-2 bg-night-900/50 group-hover:bg-night-900/80"
                    }`}
                  />
                </button>
              ))}
              <button
                type="button"
                onClick={next}
                aria-label="Próximo slide"
                className={`${controlBase} sm:hidden`}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
