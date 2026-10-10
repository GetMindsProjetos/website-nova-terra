"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  criarNoticia,
  atualizarNoticia,
  type NoticiaFormState,
} from "@/app/admin/(painel)/noticias/actions";

export type NoticiaExistente = {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  imagem_url: string | null;
  publicado: boolean;
};

export default function NoticiaForm({
  noticia,
}: {
  noticia?: NoticiaExistente;
}) {
  const router = useRouter();
  const [state, setState] = useState<NoticiaFormState>({ status: "idle" });
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = noticia
        ? await atualizarNoticia(noticia.id, state, formData)
        : await criarNoticia(state, formData);

      setState(result);
      if (result.status === "success") {
        router.push("/admin/noticias");
        router.refresh();
      }
    });
  }

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="titulo"
            className="block text-sm font-medium text-night-900"
          >
            Título
          </label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            required
            defaultValue={noticia?.titulo}
            className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-night-900"
          >
            Slug (URL)
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            defaultValue={noticia?.slug}
            placeholder="ex: aniversario-2026"
            className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="resumo"
          className="block text-sm font-medium text-night-900"
        >
          Resumo (aparece na listagem)
        </label>
        <textarea
          id="resumo"
          name="resumo"
          required
          rows={2}
          defaultValue={noticia?.resumo}
          className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
        />
      </div>

      <div>
        <label
          htmlFor="conteudo"
          className="block text-sm font-medium text-night-900"
        >
          Conteúdo completo
        </label>
        <textarea
          id="conteudo"
          name="conteudo"
          required
          rows={10}
          defaultValue={noticia?.conteudo}
          className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
        />
        <p className="mt-1 text-xs text-night-800/50">
          Separe parágrafos com uma linha em branco.
        </p>
      </div>

      <div>
        <label
          htmlFor="imagem"
          className="block text-sm font-medium text-night-900"
        >
          Imagem de capa
        </label>
        {noticia?.imagem_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={noticia.imagem_url}
            alt=""
            className="mt-2 h-32 w-full max-w-xs rounded-lg object-cover"
          />
        )}
        <input
          id="imagem"
          name="imagem"
          type="file"
          accept="image/*"
          className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-night-800">
        <input
          type="checkbox"
          name="publicado"
          defaultChecked={noticia?.publicado ?? true}
          className="accent-terra-600"
        />
        Publicada no site
      </label>

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
        {isPending ? "Salvando..." : "Salvar notícia"}
      </button>
    </form>
  );
}
