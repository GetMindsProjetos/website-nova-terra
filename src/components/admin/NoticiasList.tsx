"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { excluirNoticia } from "@/app/admin/(painel)/noticias/actions";

export type NoticiaLinha = {
  id: string;
  slug: string;
  titulo: string;
  publicado: boolean;
  publicado_em: string;
};

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function NoticiasList({
  noticias,
}: {
  noticias: NoticiaLinha[];
}) {
  const [items, setItems] = useState(noticias);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleDelete(id: string, titulo: string) {
    if (!confirm(`Excluir a notícia "${titulo}"? Essa ação não pode ser desfeita.`)) {
      return;
    }
    setDeletingId(id);
    startTransition(async () => {
      const result = await excluirNoticia(id);
      if (!result.error) {
        setItems((prev) => prev.filter((n) => n.id !== id));
      } else {
        alert(result.error);
      }
      setDeletingId(null);
    });
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-terra-100 bg-white">
      <table className="min-w-full divide-y divide-terra-100 text-sm">
        <thead className="bg-terra-50/60 text-left text-xs font-medium uppercase tracking-wide text-night-800/70">
          <tr>
            <th className="px-4 py-3">Título</th>
            <th className="px-4 py-3">Publicada em</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-terra-100">
          {items.map((n) => (
            <tr key={n.id}>
              <td className="px-4 py-3 font-medium text-night-900">
                {n.titulo}
                <div className="text-xs text-night-800/50">/{n.slug}</div>
              </td>
              <td className="px-4 py-3 text-night-800/80">
                {formatarData(n.publicado_em)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    n.publicado
                      ? "bg-terra-50 text-terra-700"
                      : "bg-night-900/5 text-night-800/60"
                  }`}
                >
                  {n.publicado ? "Publicada" : "Rascunho"}
                </span>
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <Link
                  href={`/admin/noticias/${n.id}`}
                  className="mr-4 text-sm font-medium text-terra-700 hover:text-terra-800"
                >
                  Editar
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(n.id, n.titulo)}
                  disabled={isPending && deletingId === n.id}
                  className="text-sm font-medium text-red-600 transition hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending && deletingId === n.id ? "Excluindo..." : "Excluir"}
                </button>
              </td>
            </tr>
          ))}

          {items.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-10 text-center text-night-800/60">
                Nenhuma notícia cadastrada ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
