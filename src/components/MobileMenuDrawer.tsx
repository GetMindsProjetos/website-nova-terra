"use client";

import "./mobile-menu-drawer.css";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  donateItem,
  isCurrent,
  navGroups,
  site,
  socialLinks,
  whatsappLink,
} from "@/lib/site";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

type Inertable = HTMLElement & { inert: boolean };

const ico = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function WhatsAppIcon() {
  return (
    <svg {...ico}>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.7-5A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.3-2-1-.8.8a4 4 0 0 1-1.7-1.7l.8-.8-1-2L9 9.5Z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg {...ico}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg {...ico}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg {...ico} width="20" height="20">
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
    </svg>
  );
}

export default function MobileMenuDrawer() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const navigating = useRef(false);

  useEffect(() => setMounted(true), []);

  // Declarado antes do efeito de foco: inert já está correto quando o foco é movido.
  useEffect(() => {
    if (layerRef.current) (layerRef.current as Inertable).inert = !open;
  }, [open, mounted]);

  useEffect(() => {
    // Navegação iniciada por link do drawer: foco vai ao conteúdo da nova página.
    if (navigating.current) {
      navigating.current = false;
      document.getElementById("conteudo")?.focus({ preventScroll: true });
    }
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) {
        wasOpen.current = false;
        if (!navigating.current) burgerRef.current?.focus();
      }
      const t = setTimeout(() => setExpanded(null), 500);
      return () => clearTimeout(t);
    }
    wasOpen.current = true;
    navigating.current = false;
    lockScroll();
    closeRef.current?.focus({ preventScroll: true });
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const panelEl = panelRef.current;
      const items = Array.from(
        panelEl.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]):not([tabindex="-1"])'
        )
      ).filter((el) => !el.closest('[data-collapsed="true"]'));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const inside = !!active && panelEl.contains(active);
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1280px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onChange);
    return () => {
      unlockScroll();
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onChange);
    };
  }, [open]);

  const close = () => setOpen(false);

  // Link do drawer: ao concluir a navegação o foco vai ao <main>, não ao hambúrguer.
  const closeNav = (href: string) => {
    if (href === pathname) {
      document.getElementById("conteudo")?.focus({ preventScroll: true });
    } else {
      navigating.current = true;
    }
    setOpen(false);
  };

  let n = 0;
  const idx = (): CSSProperties => ({ "--i": n++ } as CSSProperties);

  const panel = (
    <div id="md-drawer" ref={layerRef} className="md-drawer" data-open={open}>
      <button
        type="button"
        className="md-drawer__overlay"
        tabIndex={-1}
        aria-hidden="true"
        onClick={close}
      />
      <div
        ref={panelRef}
        className="md-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        tabIndex={-1}
      >
        <div className="md-drawer__head">
          <Image
            src="/logo-igreja-nova-terra.webp"
            alt="Igreja Nova Terra"
            width={974}
            height={482}
            sizes="120px"
            className="h-9 w-auto"
          />
          <button
            ref={closeRef}
            type="button"
            className="md-drawer__close"
            onClick={close}
            aria-label="Fechar menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="md-drawer__nav" aria-label="Navegação mobile">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="md-group__label md-drawer__item" style={idx()}>
                {group.label}
              </p>
              <ul className="md-list">
                {group.items.map((item) => {
                  const current = isCurrent(pathname, item.href);
                  if (!item.children) {
                    return (
                      <li key={item.href} className="md-drawer__item" style={idx()}>
                        <Link
                          href={item.href}
                          onClick={() => closeNav(item.href)}
                          className="md-drawer__link"
                          aria-current={current ? "page" : undefined}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  }
                  const panelId = `md-acc${item.href.replace(/\//g, "-")}`;
                  const isOpen = expanded === item.href;
                  return (
                    <li key={item.href} className="md-drawer__item" style={idx()}>
                      <button
                        type="button"
                        className="md-acc__btn"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        aria-current={current ? "page" : undefined}
                        onClick={() => setExpanded(isOpen ? null : item.href)}
                      >
                        <span>{item.label}</span>
                        <svg className="md-acc__chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M2.5 4.5L6 8l3.5-3.5" />
                        </svg>
                      </button>
                      <div id={panelId} className="md-acc__panel" data-collapsed={!isOpen}>
                        <div className="md-acc__inner">
                          <ul className="md-list">
                            <li>
                              <Link
                                href={item.href}
                                onClick={() => closeNav(item.href)}
                                className="md-drawer__link md-acc__overview"
                                aria-current={pathname === item.href ? "page" : undefined}
                              >
                                Ver visão geral
                              </Link>
                            </li>
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  onClick={() => closeNav(child.href)}
                                  className="md-drawer__link"
                                  aria-current={pathname === child.href ? "page" : undefined}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="md-drawer__item md-drawer__item--rise" style={idx()}>
          <Link
            href={donateItem.href}
            onClick={() => closeNav(donateItem.href)}
            className="md-drawer__cta"
            aria-current={isCurrent(pathname, donateItem.href) ? "page" : undefined}
          >
            <HeartIcon />
            {donateItem.label}
          </Link>
          <ul className="md-drawer__contacts">
            <li>
              <a
                href={whatsappLink("Olá! Gostaria de mais informações.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon />
                {site.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`}>
                <MailIcon />
                {site.email}
              </a>
            </li>
            {socialLinks.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  <GlobeIcon />
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={burgerRef}
        type="button"
        className="md-burger"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        aria-expanded={open}
        aria-controls={mounted ? "md-drawer" : undefined}
      >
        <svg className="md-burger__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      {mounted ? createPortal(panel, document.body) : null}
    </>
  );
}
