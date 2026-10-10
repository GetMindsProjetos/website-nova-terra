"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import { desktopNav, donateItem, isCurrent } from "@/lib/site";
import { useScrolled } from "@/lib/useScrolled";
import MobileMenuDrawer from "./MobileMenuDrawer";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra-800";

export default function Header() {
  const [subOpen, setSubOpen] = useState<string | null>(null);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrolled = useScrolled(16);

  useEffect(() => {
    setSubOpen(null);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function openSub(href: string) {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setSubOpen(href);
  }

  function scheduleCloseSub() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setSubOpen(null), 250);
  }

  function onGroupBlur(e: FocusEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) scheduleCloseSub();
  }

  function onGroupKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Escape") return;
    setSubOpen(null);
    e.currentTarget.querySelector<HTMLElement>("[aria-haspopup]")?.focus();
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow duration-300 ${
        scrolled
          ? "border-terra-100 shadow-sm shadow-night-900/5"
          : "border-transparent"
      }`}
    >
      {/* Sem "relative" aqui nem nos grupos: o mega-menu posiciona-se em relação ao header (sticky). */}
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-4 transition-[padding] duration-300 sm:px-6 ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        <Link
          href="/"
          className={`flex shrink-0 items-center rounded-md ${focusRing}`}
          aria-current={pathname === "/" ? "page" : undefined}
        >
          <Image
            src="/logo-igreja-nova-terra.webp"
            alt="Igreja Nova Terra — ícone de leão e chama com o nome da igreja"
            width={974}
            height={482}
            sizes="(min-width: 640px) 81px, 73px"
            priority
            className={`w-auto transition-all duration-300 ${
              scrolled ? "h-7 sm:h-8" : "h-9 sm:h-10"
            }`}
          />
        </Link>

        <nav
          aria-label="Principal"
          className="ml-8 hidden items-center xl:flex xl:gap-0 2xl:gap-0.5"
        >
          {desktopNav.map((item) => {
            const current = isCurrent(pathname, item.href);
            const linkClass = `whitespace-nowrap rounded-md px-2 py-2 text-[13px] font-medium text-night-800 transition hover:bg-terra-50 hover:text-terra-800 aria-[current=page]:text-terra-800 2xl:px-3 2xl:text-sm ${focusRing}`;
            return item.children ? (
              <div
                key={item.href}
                onMouseEnter={() => openSub(item.href)}
                onMouseLeave={scheduleCloseSub}
                onFocus={() => openSub(item.href)}
                onBlur={onGroupBlur}
                onKeyDown={onGroupKeyDown}
              >
                <Link
                  href={item.href}
                  aria-haspopup="true"
                  aria-expanded={subOpen === item.href}
                  aria-current={current ? "page" : undefined}
                  className={`flex items-center gap-1 ${linkClass}`}
                >
                  {item.label}
                  <svg
                    viewBox="0 0 12 12"
                    aria-hidden="true"
                    className={`h-3 w-3 fill-none stroke-current stroke-[1.5] transition-transform duration-200 ${
                      subOpen === item.href ? "rotate-180" : ""
                    }`}
                  >
                    <path d="M2.5 4.5L6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>

                <div
                  className={`absolute inset-x-0 top-full z-40 px-3 pt-3 transition-all duration-200 sm:px-6 ${
                    subOpen === item.href
                      ? "pointer-events-auto visible translate-y-0 opacity-100"
                      : "pointer-events-none invisible -translate-y-1 opacity-0"
                  }`}
                >
                  <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-gradient-to-br from-terra-100 via-terra-50 to-white shadow-2xl ring-1 ring-black/5">
                    <div className="grid gap-8 p-7 sm:p-8 md:grid-cols-[220px_1fr] md:gap-12">
                      <div className="md:border-r md:border-night-900/10 md:pr-8">
                        <p className="text-xs font-semibold uppercase tracking-widest text-terra-800">
                          {item.label}
                        </p>
                        {item.description && (
                          <p className="mt-3 text-sm leading-relaxed text-night-800/80">
                            {item.description}
                          </p>
                        )}
                        <Link
                          href={item.href}
                          className={`mt-5 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-terra-800 transition-all hover:gap-2.5 ${focusRing}`}
                        >
                          Ver visão geral
                          <span aria-hidden>→</span>
                        </Link>
                      </div>

                      <div
                        className={`grid gap-x-6 gap-y-1 ${
                          item.children.length > 8
                            ? "sm:grid-cols-2 lg:grid-cols-3"
                            : "sm:grid-cols-2"
                        }`}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            aria-current={pathname === child.href ? "page" : undefined}
                            className={`rounded-lg px-3 py-2.5 transition hover:bg-white/70 ${focusRing}`}
                          >
                            <span className="block text-sm font-medium leading-snug text-night-900">
                              {child.label}
                            </span>
                            {child.description && (
                              <span className="mt-0.5 block text-xs leading-snug text-night-800/75">
                                {child.description}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={linkClass}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href={donateItem.href}
            aria-current={isCurrent(pathname, donateItem.href) ? "page" : undefined}
            className={`ml-1 whitespace-nowrap rounded-full bg-terra-600 px-3 py-2 text-[13px] font-semibold text-night-900 shadow-sm shadow-terra-900/10 transition hover:bg-terra-500 2xl:ml-2 2xl:px-4 2xl:text-sm ${focusRing}`}
          >
            {donateItem.label}
          </Link>
        </nav>

        {/* Botão + painel (portal em document.body): o backdrop-filter do header prenderia um fixed. */}
        <MobileMenuDrawer />
      </div>
    </header>
  );
}
