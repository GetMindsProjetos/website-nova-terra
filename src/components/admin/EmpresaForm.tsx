"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  criarEmpresa,
  atualizarEmpresa,
  type EmpresaFormState,
} from "@/app/admin/(painel)/empresas/actions";
import { CATEGORIAS_EMPRESA } from "@/lib/categoriasEmpresa";

export type EmpresaExistente = {
  id: string;
  slug: string;
  nome: string;
  categoria: string;
  descricao: string;
  nome_responsavel: string | null;
  whatsapp: string;
  instagram: string | null;
  logo_url: string | null;
  capa_url: string | null;
  publicado: boolean;
  ordem: number;
};

export default function EmpresaForm({
  empresa,
}: {
  empresa?: EmpresaExistente;
}) {
  const router = useRouter();
  const [state, setState] = useState<EmpresaFormState>({ status: "idle" });
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = empresa
        ? await atualizarEmpresa(empresa.id, state, formData)
        : await criarEmpresa(state, formData);

      setState(result);
      if (result.status === "success") {
        router.push("/admin/empresas");
        router.refresh();
      }
    });
  }

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-night-900">
            Nome da empresa
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            defaultValue={empresa?.nome}
            className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-night-900">
            Slug (URL)
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            defaultValue={empresa?.slug}
            placeholder="ex: doces-da-vovo"
            className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-night-900">
            Ramo / categoria
          </label>
          <select
            id="categoria"
            name="categoria"
            defaultValue={empresa?.categoria ?? "outros"}
            className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
          >
            {Object.entries(CATEGORIAS_EMPRESA).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="nomeResponsavel" className="block text-sm font-medium text-night-900">
            Nome do responsável (opcional)
          </label>
          <input
            id="nomeResponsavel"
            name="nomeResponsavel"
            type="text"
            defaultValue={empresa?.nome_responsavel ?? ""}
            className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-night-900">
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          required
          rows={4}
          defaultValue={empresa?.descricao}
          className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-night-900">
            WhatsApp comercial
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="text"
            required
            defaultValue={empresa?.whatsapp}
            placeholder="ex: 5591987654321"
            className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
          />
          <p className="mt-1 text-xs text-night-800/50">
            Só números, com DDI e DDD (ex: 5591987654321).
          </p>
        </div>

        <div>
          <label htmlFor="instagram" className="block text-sm font-medium text-night-900">
            Instagram (opcional)
          </label>
          <input
            id="instagram"
            name="instagram"
            type="url"
            defaultValue={empresa?.instagram ?? ""}
            placeholder="https://instagram.com/..."
            className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="logo" className="block text-sm font-medium text-night-900">
            Logo
          </label>
          {empresa?.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={empresa.logo_url}
              alt=""
              className="mt-2 h-16 w-16 rounded-xl object-cover"
            />
          )}
          <input
            id="logo"
            name="logo"
            type="file"
            accept="image/*"
            className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
          />
        </div>

        <div>
          <label htmlFor="capa" className="block text-sm font-medium text-night-900">
            Imagem de capa
          </label>
          {empresa?.capa_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={empresa.capa_url}
              alt=""
              className="mt-2 h-16 w-full max-w-xs rounded-lg object-cover"
            />
          )}
          <input
            id="capa"
            name="capa"
            type="file"
            accept="image/*"
            className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ordem" className="block text-sm font-medium text-night-900">
            Ordem de exibição
          </label>
          <input
            id="ordem"
            name="ordem"
            type="number"
            defaultValue={empresa?.ordem ?? 0}
            className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
          />
        </div>

        <label className="flex items-center gap-2 self-end pb-2.5 text-sm text-night-800">
          <input
            type="checkbox"
            name="publicado"
            defaultChecked={empresa?.publicado ?? true}
            className="accent-terra-600"
          />
          Publicado no site
        </label>
      </div>

      {state.status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-terra-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-terra-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Salvando..." : "Salvar empresa"}
      </button>
    </form>
  );
}
