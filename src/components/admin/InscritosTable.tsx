"use client";

import { useState, useTransition } from "react";
import { excluirInscricao } from "@/app/admin/(painel)/inscritos/actions";

export type Inscricao = {
  id: string;
  created_at: string;
  evento_slug: string;
  evento_titulo: string;
  nome: string;
  email: string | null;
  telefone: string;
  endereco: string;
  membro: boolean;
  segmento: string | null;
};

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function paraCsv(linhas: Inscricao[]) {
  const cabecalho = [
    "Nome",
    "E-mail",
    "Telefone",
    "Endereço",
    "Membro",
    "Segmento",
    "Evento",
    "Inscrito em",
  ];

  const escapar = (valor: string) => `"${valor.replace(/"/g, '""')}"`;

  const linhasCsv = linhas.map((i) =>
    [
      i.nome,
      i.email ?? "",
      i.telefone,
      i.endereco,
      i.membro ? "Sim" : "Não",
      i.segmento ?? "",
      i.evento_titulo,
      formatarData(i.created_at),
    ]
      .map(escapar)
      .join(",")
  );

  return [cabecalho.map(escapar).join(","), ...linhasCsv].join("\n");
}

function exportarCsv(linhas: Inscricao[]) {
  const csv = "﻿" + paraCsv(linhas);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `inscritos-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function InscritosTable({
  inscricoes,
}: {
  inscricoes: Inscricao[];
}) {
  const [items, setItems] = useState(inscricoes);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleDelete(id: string) {
    if (!confirm("Excluir esta inscrição? Essa ação não pode ser desfeita.")) {
      return;
    }
    setDeletingId(id);
    startTransition(async () => {
      const result = await excluirInscricao(id);
      if (!result.error) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      } else {
        alert(result.error);
      }
      setDeletingId(null);
    });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-night-800/70">
          {items.length} inscrição{items.length === 1 ? "" : "s"}
        </p>
        <button
          type="button"
          onClick={() => exportarCsv(items)}
          disabled={items.length === 0}
          className="rounded-full border border-terra-200 px-4 py-2 text-sm font-medium text-night-800 transition hover:border-terra-400 hover:text-terra-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Exportar CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-terra-100 bg-white">
        <table className="min-w-full divide-y divide-terra-100 text-sm">
          <thead className="bg-terra-50/60 text-left text-xs font-medium uppercase tracking-wide text-night-800/70">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Contato</th>
              <th className="px-4 py-3">Endereço</th>
              <th className="px-4 py-3">Membro</th>
              <th className="px-4 py-3">Segmento</th>
              <th className="px-4 py-3">Evento</th>
              <th className="px-4 py-3">Inscrito em</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-terra-100">
            {items.map((i) => (
              <tr key={i.id}>
                <td className="px-4 py-3 font-medium text-night-900">
                  {i.nome}
                </td>
                <td className="px-4 py-3 text-night-800/80">
                  <div>{i.email}</div>
                  <div className="text-night-800/60">{i.telefone}</div>
                </td>
                <td className="px-4 py-3 text-night-800/80">{i.endereco}</td>
                <td className="px-4 py-3 text-night-800/80">
                  {i.membro ? "Sim" : "Não"}
                </td>
                <td className="px-4 py-3 text-night-800/80">
                  {i.segmento ?? "—"}
                </td>
                <td className="px-4 py-3 text-night-800/80">
                  {i.evento_titulo}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-night-800/60">
                  {formatarData(i.created_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(i.id)}
                    disabled={isPending && deletingId === i.id}
                    className="text-sm font-medium text-red-600 transition hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPending && deletingId === i.id
                      ? "Excluindo..."
                      : "Excluir"}
                  </button>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-night-800/60"
                >
                  Nenhuma inscrição encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
