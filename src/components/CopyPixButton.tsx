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

export default function CopyPixButton({ chave }: { chave: string }) {
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function agendarReset() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setCopiado(false);
      setErro(false);
    }, 2000);
  }

  async function handleCopy() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(chave);
      ok = true;
    } catch {
      ok = copiarComFallback(chave);
    }
    setCopiado(ok);
    setErro(!ok);
    agendarReset();
  }

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-terra-600 px-6 py-3 text-sm font-semibold text-night-900 transition hover:bg-terra-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-900"
      >
        {copiado ? "Chave copiada" : "Copiar chave PIX"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copiado
          ? "Chave PIX copiada para a área de transferência."
          : erro
            ? "Não foi possível copiar. Selecione a chave e copie manualmente."
            : ""}
      </span>
      {erro && (
        <span className="mt-2 block text-sm font-medium text-red-700" aria-hidden="true">
          Não foi possível copiar. Selecione a chave e copie manualmente.
        </span>
      )}
    </>
  );
}
