"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  criarEvento,
  atualizarEvento,
  type EventoFormState,
} from "@/app/admin/(painel)/eventos/actions";

export type EventoExistente = {
  id: string;
  slug: string;
  titulo: string;
  detalhe: string | null;
  descricao: string;
  categoria: "geral" | "empreendedores";
  imagem_url: string | null;
  inscricoes_abertas: boolean;
  publicado: boolean;
  ordem: number;
  gratuito: boolean;
  preco: number | null;
  palestrante: string | null;
  data_evento: string | null;
  hora_evento: string | null;
  patrocinadores: { nome: string; logoUrl: string | null }[];
};

const MAX_PATROCINADORES = 5;

export default function EventoForm({
  evento,
}: {
  evento?: EventoExistente;
}) {
  const router = useRouter();
  const [state, setState] = useState<EventoFormState>({ status: "idle" });
  const [isPending, startTransition] = useTransition();
  const [gratuito, setGratuito] = useState(evento?.gratuito ?? true);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = evento
        ? await atualizarEvento(evento.id, state, formData)
        : await criarEvento(state, formData);

      setState(result);
      if (result.status === "success") {
        router.push("/admin/eventos");
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
            defaultValue={evento?.titulo}
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
            defaultValue={evento?.slug}
            placeholder="ex: encontro-de-casais"
            className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="detalhe"
          className="block text-sm font-medium text-night-900"
        >
          Detalhe curto (ex: nome da Rede)
        </label>
        <input
          id="detalhe"
          name="detalhe"
          type="text"
          defaultValue={evento?.detalhe ?? ""}
          className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="dataEvento"
            className="block text-sm font-medium text-night-900"
          >
            Data do evento
          </label>
          <input
            id="dataEvento"
            name="dataEvento"
            type="date"
            defaultValue={evento?.data_evento ?? ""}
            className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
          />
        </div>

        <div>
          <label
            htmlFor="horaEvento"
            className="block text-sm font-medium text-night-900"
          >
            Horário
          </label>
          <input
            id="horaEvento"
            name="horaEvento"
            type="text"
            defaultValue={evento?.hora_evento ?? ""}
            placeholder="ex: 19h ou 08h30"
            className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="palestrante"
          className="block text-sm font-medium text-night-900"
        >
          Palestrante (opcional)
        </label>
        <input
          id="palestrante"
          name="palestrante"
          type="text"
          defaultValue={evento?.palestrante ?? ""}
          placeholder="Nome de quem vai palestrar/ministrar"
          className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
        />
      </div>

      <div>
        <label
          htmlFor="descricao"
          className="block text-sm font-medium text-night-900"
        >
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          required
          rows={4}
          defaultValue={evento?.descricao}
          className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="categoria"
            className="block text-sm font-medium text-night-900"
          >
            Categoria
          </label>
          <select
            id="categoria"
            name="categoria"
            defaultValue={evento?.categoria ?? "geral"}
            className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
          >
            <option value="geral">Geral</option>
            <option value="empreendedores">Empreendedores</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="ordem"
            className="block text-sm font-medium text-night-900"
          >
            Ordem de exibição
          </label>
          <input
            id="ordem"
            name="ordem"
            type="number"
            defaultValue={evento?.ordem ?? 0}
            className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <span className="block text-sm font-medium text-night-900">
            Valor
          </span>
          <div className="mt-1 flex gap-6 rounded-lg border border-terra-200 px-4 py-2.5">
            <label className="flex items-center gap-2 text-sm text-night-800">
              <input
                type="radio"
                name="valorTipo"
                value="gratuito"
                checked={gratuito}
                onChange={() => setGratuito(true)}
                className="accent-terra-600"
              />
              Gratuito
            </label>
            <label className="flex items-center gap-2 text-sm text-night-800">
              <input
                type="radio"
                name="valorTipo"
                value="pago"
                checked={!gratuito}
                onChange={() => setGratuito(false)}
                className="accent-terra-600"
              />
              Pago
            </label>
          </div>
        </div>

        {!gratuito && (
          <div>
            <label
              htmlFor="preco"
              className="block text-sm font-medium text-night-900"
            >
              Preço (R$)
            </label>
            <input
              id="preco"
              name="preco"
              type="number"
              min="0"
              step="0.01"
              required={!gratuito}
              defaultValue={evento?.preco ?? ""}
              placeholder="ex: 25,00"
              className="mt-1 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
            />
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="imagem"
          className="block text-sm font-medium text-night-900"
        >
          Imagem de capa
        </label>
        <p className="mt-1 text-xs text-night-800/50">
          Exibida em proporção 4:3 nos cards. A imagem é otimizada
          automaticamente para a web ao salvar.
        </p>
        {evento?.imagem_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={evento.imagem_url}
            alt=""
            className="mt-2 aspect-[4/3] w-full max-w-xs rounded-lg object-cover"
          />
        )}
        <input
          id="imagem"
          name="imagem"
          type="file"
          accept="image/*"
          className="mt-2 w-full rounded-lg border border-terra-200 px-4 py-2.5 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-night-900">
          Patrocinadores (opcional, até {MAX_PATROCINADORES})
        </span>
        <div className="mt-2 space-y-3">
          {Array.from({ length: MAX_PATROCINADORES }, (_, i) => {
            const n = i + 1;
            const atual = evento?.patrocinadores?.[i];
            return (
              <div
                key={n}
                className="grid gap-3 rounded-lg border border-terra-100 p-3 sm:grid-cols-[1fr_auto_auto] sm:items-center"
              >
                <input
                  name={`patrocinadorNome${n}`}
                  type="text"
                  defaultValue={atual?.nome ?? ""}
                  placeholder={`Nome do patrocinador ${n}`}
                  className="w-full rounded-lg border border-terra-200 px-3 py-2 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
                />
                {atual?.logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={atual.logoUrl}
                    alt=""
                    className="h-10 w-10 rounded-md border border-terra-100 object-contain"
                  />
                )}
                <input
                  name={`patrocinadorLogo${n}`}
                  type="file"
                  accept="image/*"
                  className="w-full text-xs sm:w-40"
                />
                <input
                  type="hidden"
                  name={`patrocinadorLogoAtual${n}`}
                  defaultValue={atual?.logoUrl ?? ""}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-night-800">
          <input
            type="checkbox"
            name="inscricoesAbertas"
            defaultChecked={evento?.inscricoes_abertas ?? false}
            className="accent-terra-600"
          />
          Inscrições abertas
        </label>
        <label className="flex items-center gap-2 text-sm text-night-800">
          <input
            type="checkbox"
            name="publicado"
            defaultChecked={evento?.publicado ?? true}
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
        {isPending ? "Salvando..." : "Salvar evento"}
      </button>
    </form>
  );
}
