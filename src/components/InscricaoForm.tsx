"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { inscreverEmEvento, type InscricaoState } from "@/app/eventos/actions";
import type { Evento } from "@/lib/eventos";
import InscricaoSucessoModal from "@/components/InscricaoSucessoModal";

type FieldErrors = Partial<
  Record<"nome" | "email" | "telefone" | "endereco" | "membro" | "segmento", string>
>;

const inputClass =
  "mt-1 w-full rounded-lg border bg-white px-4 py-2.5 text-base text-night-900 focus:border-terra-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-terra-600 aria-[invalid=true]:border-red-700 sm:text-sm";
const inputBorder = "border-night-800/60";
const errorClass = "mt-1 text-sm font-medium text-red-700";

// Mesmas regras do servidor (src/app/eventos/actions.ts) para dar retorno por campo.
function validar(form: HTMLFormElement, empreendedores: boolean): FieldErrors {
  const data = new FormData(form);
  const get = (k: string) => String(data.get(k) || "").trim();
  const errors: FieldErrors = {};
  if (get("nome").length < 3) errors.nome = "Informe seu nome completo.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("email"))) {
    errors.email = "Informe um e-mail válido.";
  }
  if (get("telefone").replace(/\D/g, "").length < 10) {
    errors.telefone = "Informe um telefone/WhatsApp válido, com DDD.";
  }
  if (get("endereco").length < 5) errors.endereco = "Informe seu endereço.";
  const membro = get("membro");
  if (membro !== "sim" && membro !== "nao") {
    errors.membro = "Informe se você é membro da igreja.";
  }
  if (empreendedores && !get("segmento")) {
    errors.segmento = "Informe o segmento em que você atua.";
  }
  return errors;
}

const FIELD_ORDER: (keyof FieldErrors)[] = [
  "nome",
  "email",
  "telefone",
  "endereco",
  "membro",
  "segmento",
];

export default function InscricaoForm({ evento }: { evento: Evento }) {
  const [state, setState] = useState<InscricaoState>({ status: "idle" });
  const [isPending, startTransition] = useTransition();
  const [modalAberto, setModalAberto] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const empreendedores = evento.categoria === "empreendedores";

  // Ao fechar o modal o formulário já foi substituído pela confirmação:
  // devolve o foco a ela para não perder o ponto de leitura.
  useEffect(() => {
    if (state.status === "success" && !modalAberto) {
      successRef.current?.focus();
    }
  }, [state.status, modalAberto]);

  function focusField(name: keyof FieldErrors) {
    const form = formRef.current;
    if (!form) return;
    const el = form.elements.namedItem(name);
    const target = el instanceof RadioNodeList ? (el[0] as HTMLElement) : (el as HTMLElement | null);
    target?.focus();
  }

  function enviar(formData: FormData) {
    formData.set("eventoSlug", evento.slug);
    startTransition(async () => {
      const result = await inscreverEmEvento(state, formData);
      setState(result);
      if (result.status === "success") setModalAberto(true);
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPending) return;
    const form = e.currentTarget;
    const found = validar(form, empreendedores);
    setErrors(found);
    const first = FIELD_ORDER.find((k) => found[k]);
    if (first) {
      setState({ status: "idle" });
      focusField(first);
      return;
    }
    enviar(new FormData(form));
  }

  if (state.status === "success") {
    return (
      <>
        <div
          ref={successRef}
          tabIndex={-1}
          role="status"
          className="rounded-2xl glass p-8 text-center focus:outline-none"
        >
          <p className="font-serif text-xl font-medium text-night-900">
            Inscrição confirmada! <span aria-hidden="true">🎉</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-night-800">
            Recebemos os seus dados para o evento &quot;{evento.titulo}&quot;.
            Em breve alguém da equipe pode entrar em contato com mais
            detalhes.
          </p>
        </div>
        {modalAberto && (
          <InscricaoSucessoModal
            eventoTitulo={evento.titulo}
            onClose={() => setModalAberto(false)}
          />
        )}
      </>
    );
  }

  function describedBy(name: keyof FieldErrors, extra?: string) {
    const ids = [extra, errors[name] ? `erro-${name}` : undefined].filter(Boolean);
    return ids.length ? ids.join(" ") : undefined;
  }

  function fieldProps(name: keyof FieldErrors, extra?: string) {
    return {
      "aria-invalid": errors[name] ? (true as const) : undefined,
      "aria-describedby": describedBy(name, extra),
      className: `${inputClass} ${inputBorder}`,
    };
  }

  const erroMsg = (name: keyof FieldErrors) =>
    errors[name] ? (
      <p id={`erro-${name}`} className={errorClass}>
        {errors[name]}
      </p>
    ) : null;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-busy={isPending}
      className="space-y-5"
    >
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-night-900">
          Nome completo
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          autoComplete="name"
          required
          minLength={3}
          placeholder="Seu nome completo"
          {...fieldProps("nome")}
        />
        {erroMsg("nome")}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-night-900">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="seuemail@exemplo.com"
          {...fieldProps("email")}
        />
        {erroMsg("email")}
      </div>

      <div>
        <label htmlFor="telefone" className="block text-sm font-medium text-night-900">
          Telefone / WhatsApp
        </label>
        <input
          id="telefone"
          name="telefone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          placeholder="(91) 90000-0000"
          {...fieldProps("telefone", "ajuda-telefone")}
        />
        <p id="ajuda-telefone" className="mt-1 text-sm text-night-800">
          Informe com DDD. Exemplo: (91) 90000-0000.
        </p>
        {erroMsg("telefone")}
      </div>

      <div>
        <label htmlFor="endereco" className="block text-sm font-medium text-night-900">
          Endereço
        </label>
        <input
          id="endereco"
          name="endereco"
          type="text"
          autoComplete="street-address"
          required
          minLength={5}
          placeholder="Rua, número, bairro"
          {...fieldProps("endereco")}
        />
        {erroMsg("endereco")}
      </div>

      <fieldset aria-describedby={describedBy("membro")}>
        <legend className="block text-sm font-medium text-night-900">
          Você é membro da Nova Terra?
        </legend>
        <div className="mt-1 flex gap-2">
          <label className="flex min-h-[44px] items-center gap-2 pr-4 text-sm text-night-900">
            <input
              type="radio"
              name="membro"
              value="sim"
              required
              className="h-5 w-5 accent-terra-700"
            />
            Sim
          </label>
          <label className="flex min-h-[44px] items-center gap-2 pr-4 text-sm text-night-900">
            <input
              type="radio"
              name="membro"
              value="nao"
              required
              className="h-5 w-5 accent-terra-700"
            />
            Não
          </label>
        </div>
        {erroMsg("membro")}
      </fieldset>

      {empreendedores && (
        <div>
          <label htmlFor="segmento" className="block text-sm font-medium text-night-900">
            Em qual segmento você atua?
          </label>
          <input
            id="segmento"
            name="segmento"
            type="text"
            autoComplete="off"
            required
            placeholder="Ex.: alimentação, beleza, tecnologia, construção..."
            {...fieldProps("segmento")}
          />
          {erroMsg("segmento")}
        </div>
      )}

      <div role="alert">
        {state.status === "error" && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {state.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        aria-disabled={isPending}
        aria-busy={isPending}
        className="min-h-[48px] w-full rounded-full btn-glass-accent px-6 py-3 text-sm font-medium text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-900 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Enviando..." : "Confirmar inscrição"}
      </button>
    </form>
  );
}
