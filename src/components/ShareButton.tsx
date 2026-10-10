"use client";

import { useEffect, useRef, useState } from "react";

function copiarComFallback(texto: string): boolean {
  const ta = document.createElement("textarea");
  ta.value = texto;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  ta.setSelectionRange(0, texto.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(ta);
  return ok;
}

export default function ShareButton({
  title,
  text,
  path,
}: {
  title: string;
  text: string;
  path: string;
}) {
  const [copiado, setCopiado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function anunciar(msg: string, marcarCopiado: boolean) {
    setMensagem(msg);
    setCopiado(marcarCopiado);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setCopiado(false);
      setMensagem("");
    }, 2500);
  }

  async function handleShare() {
    const url = `${window.location.origin}${path}`;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        // Usuário cancelou: não é erro.
        if (err instanceof DOMException && err.name === "AbortError") return;
        // Falha real: segue para a cópia do link.
      }
    }

    let ok = false;
    try {
      await navigator.clipboard.writeText(url);
      ok = true;
    } catch {
      ok = copiarComFallback(url);
    }

    if (ok) {
      anunciar("Link copiado para a área de transferência.", true);
    } else {
      anunciar("Não foi possível compartilhar. Abrindo o WhatsApp.", false);
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleShare}
        aria-label={`Compartilhar: ${title}`}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-terra-700 text-terra-800 transition hover:bg-terra-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra-800"
      >
        {copiado ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2" aria-hidden="true">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.5]" aria-hidden="true">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="M8.6 13.5l6.8 3.9M15.4 6.6L8.6 10.5" strokeLinecap="round" />
          </svg>
        )}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {mensagem}
      </span>
    </>
  );
}
