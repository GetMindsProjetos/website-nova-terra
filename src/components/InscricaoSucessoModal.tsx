"use client";

import { useEffect, useRef } from "react";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

const WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/0029Vb8xNRT5a24CnToFzT0H";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function InscricaoSucessoModal({
  eventoTitulo,
  onClose,
}: {
  eventoTitulo: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    lockScroll();
    titleRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) {
        e.preventDefault();
        titleRef.current?.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!dialog.contains(active) || active === titleRef.current) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      unlockScroll();
      if (opener && opener.isConnected) opener.focus();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-night-900/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inscricao-sucesso-titulo"
        aria-describedby="inscricao-sucesso-desc"
        className="max-h-full w-full max-w-sm overflow-y-auto rounded-3xl bg-white text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-br from-terra-800 via-terra-700 to-terra-800 px-6 py-8">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden="true">
              <path d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6L19 6.4 17.6 5 12 10.6z" />
            </svg>
          </button>
          <div
            aria-hidden="true"
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-3xl"
          >
            🎉
          </div>
          <h2
            id="inscricao-sucesso-titulo"
            ref={titleRef}
            tabIndex={-1}
            className="mt-4 font-serif text-xl font-medium text-white focus:outline-none"
          >
            Inscrição confirmada!
          </h2>
          <p className="mt-1 text-sm text-white">
            Você garantiu sua vaga em &quot;{eventoTitulo}&quot;.
          </p>
        </div>

        <div className="px-6 py-6">
          <p id="inscricao-sucesso-desc" className="text-sm leading-relaxed text-night-800">
            Entre no nosso canal do WhatsApp para acompanhar novidades, lembretes e o
            andamento do evento em primeira mão.
          </p>
          <a
            href={WHATSAPP_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-medium text-night-900 shadow-lg shadow-[#25D366]/30 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-900 active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-night-900" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.82L2 22l5.4-1.42a9.9 9.9 0 0 0 4.64 1.18h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.87 9.87 0 0 0 12.04 2m0 1.8a8.1 8.1 0 0 1 8.1 8.1c0 4.47-3.63 8.1-8.1 8.1a8.03 8.03 0 0 1-4.1-1.12l-.29-.17-3.2.84.86-3.12-.19-.32a8.03 8.03 0 0 1-1.24-4.31 8.1 8.1 0 0 1 8.16-8m-4.5 4.15c-.19 0-.5.07-.76.36s-1 .97-1 2.37 1.02 2.75 1.16 2.94c.14.19 1.98 3.02 4.8 4.24.67.29 1.2.46 1.6.59.68.22 1.29.19 1.78.11.54-.08 1.66-.68 1.9-1.34s.24-1.22.17-1.34c-.07-.12-.26-.19-.55-.34s-1.66-.82-1.92-.91c-.26-.1-.44-.14-.63.14s-.73.9-.9 1.09c-.16.19-.33.21-.61.07-.29-.14-1.2-.44-2.29-1.41-.85-.75-1.42-1.68-1.59-1.96-.16-.29-.02-.44.13-.58.13-.13.29-.34.43-.5s.19-.29.29-.48c.1-.19.05-.36-.02-.5-.07-.14-.63-1.55-.88-2.12-.23-.55-.47-.48-.65-.49z" />
            </svg>
            Entrar no canal do WhatsApp
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
