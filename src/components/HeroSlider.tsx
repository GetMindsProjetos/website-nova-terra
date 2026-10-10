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
  image?: { desktop: string; mobile: string; alt: string };
};

const AUTOPLAY_MS = 6500;

const controlBase =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-night-900/70 text-white backdrop-blur transition hover:bg-night-900/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tick, setTick] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hoverFocusPaused, setHoverFocusPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [parallax, setParallax] = useState(0);
  const [preload, setPreload] = useState(false);
  const [inView, setInView] = useState(true);
  const [docHidden, setDocHidden] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Slides 1+ só carregam imagem após hidratar e (interação ou idle/2,5 s),
  // para não competir com o LCP do slide 0.
  useEffect(() => {
    let done = false;
    let idleId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const events = ["pointerdown", "touchstart", "keydown", "scroll"] as const;

    function cleanup() {
      events.forEach((ev) => window.removeEventListener(ev, trigger));
      if (timeoutId !== null) clearTimeout(timeoutId);
      if (idleId !== null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
    }
    function trigger() {
      if (done) return;
      done = true;
      cleanup();
      setPreload(true);
    }

    events.forEach((ev) => window.addEventListener(ev, trigger, { passive: true }));
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(trigger, { timeout: 2500 });
    } else {
      timeoutId = setTimeout(trigger, 2500);
    }
    return cleanup;
  }, []);

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

  useEffect(() => {
    if (reducedMotion) {
      setParallax(0);
      return;
    }

    let rafId: number | null = null;
    function onScroll() {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const section = sectionRef.current;
        if (!section) return;
        const rect = section.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        setParallax(Math.max(-30, Math.min(30, rect.top * -0.12)));
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  const goTo = useCallback(
    (index: number) => {
      setPreload(true);
      setActiveIndex((index + slides.length) % slides.length);
      setTick((t) => t + 1);
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
      className="relative h-[560px] overflow-hidden sm:h-[640px] lg:h-[680px]"
      onMouseEnter={() => setHoverFocusPaused(true)}
      onMouseLeave={() => setHoverFocusPaused(false)}
      onFocus={() => setHoverFocusPaused(true)}
      onBlur={handleBlur}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
          const showImage = index === 0 || preload;
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
              {slide.image ? (
                <div
                  className="absolute -inset-y-8 inset-x-0 overflow-hidden bg-night-900"
                  style={{ transform: `translateY(${parallax}px)` }}
                >
                  <div
                    key={isActive ? `active-${tick}` : "idle"}
                    className={`h-full w-full ${isActive ? "hero-ken-burns" : ""}`}
                  >
                    {showImage && (
                      <picture>
                        <source media="(min-width: 768px)" srcSet={slide.image.desktop} />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={slide.image.mobile}
                          alt=""
                          className="h-full w-full object-cover"
                          loading={index === 0 ? "eager" : "lazy"}
                          fetchPriority={index === 0 ? "high" : "auto"}
                          decoding="async"
                        />
                      </picture>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/10" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-terra-50 via-white to-white" />
              )}

              <div className="relative mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-4 pb-16 text-center sm:px-6">
                {slide.eyebrow && (
                  <p
                    className={`text-sm font-semibold uppercase tracking-widest ${
                      slide.image ? "text-terra-300" : "text-terra-800"
                    }`}
                  >
                    {slide.eyebrow}
                  </p>
                )}
                <Heading
                  className={`mt-4 font-serif text-3xl font-bold leading-tight sm:text-5xl ${
                    slide.image ? "text-white" : "text-night-900"
                  }`}
                >
                  {slide.title}
                </Heading>
                {slide.subtitle && (
                  <p
                    className={`mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg ${
                      slide.image ? "text-white/90" : "text-night-800"
                    }`}
                  >
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
            <div className="flex max-w-full flex-wrap items-center justify-center gap-1 rounded-full bg-night-900/60 p-1 backdrop-blur">
              <button
                type="button"
                onClick={prev}
                aria-label="Slide anterior"
                className={`${controlBase} bg-transparent sm:hidden`}
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
                className={`${controlBase} bg-transparent`}
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
                  className="group flex h-11 min-w-[2.75rem] items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span
                    aria-hidden="true"
                    className={`block h-2 rounded-full transition-all motion-reduce:transition-none ${
                      index === activeIndex
                        ? "w-6 bg-white"
                        : "w-2 bg-white/60 group-hover:bg-white/80"
                    }`}
                  />
                </button>
              ))}
              <button
                type="button"
                onClick={next}
                aria-label="Próximo slide"
                className={`${controlBase} bg-transparent sm:hidden`}
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
