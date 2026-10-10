"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { excluirEvento } from "@/app/admin/(painel)/eventos/actions";

export type EventoLinha = {
  id: string;
  slug: string;
  titulo: string;
  categoria: string;
  publicado: boolean;
  inscricoes_abertas: boolean;
  ordem: number;
};

export default function EventosList({ eventos }: { eventos: EventoLinha[] }) {
  const [items, setItems] = useState(eventos);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleDelete(id: string, titulo: string) {
    if (!confirm(`Excluir o evento "${titulo}"? Essa ação não pode ser desfeita.`)) {
      return;
    }
    setDeletingId(id);
    startTransition(async () => {
      const result = await excluirEvento(id);
      if (!result.error) {
        setItems((prev) => prev.filter((e) => e.id !== id));
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
            <th className="px-4 py-3">Categoria</th>
            <th className="px-4 py-3">Inscrições</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-terra-100">
          {items.map((e) => (
            <tr key={e.id}>
              <td className="px-4 py-3 font-medium text-night-900">
                {e.titulo}
                <div className="text-xs text-night-800/50">/{e.slug}</div>
              </td>
              <td className="px-4 py-3 text-night-800/80 capitalize">
                {e.categoria}
              </td>
              <td className="px-4 py-3 text-night-800/80">
                {e.inscricoes_abertas ? "Abertas" : "Fechadas"}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    e.publicado
                      ? "bg-terra-50 text-terra-700"
                      : "bg-night-900/5 text-night-800/60"
                  }`}
                >
                  {e.publicado ? "Publicado" : "Rascunho"}
                </span>
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <Link
                  href={`/admin/eventos/${e.id}`}
                  className="mr-4 text-sm font-medium text-terra-700 hover:text-terra-800"
                >
                  Editar
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(e.id, e.titulo)}
                  disabled={isPending && deletingId === e.id}
                  className="text-sm font-medium text-red-600 transition hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending && deletingId === e.id ? "Excluindo..." : "Excluir"}
                </button>
              </td>
            </tr>
          ))}

          {items.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-night-800/60">
                Nenhum evento cadastrado ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
