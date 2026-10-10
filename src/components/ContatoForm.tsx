"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { enviarContato, type ContatoState } from "@/app/fale-conosco/actions";

type Assunto = "oracao" | "contato" | "novidades";
type FieldErrors = Partial<
  Record<"assunto" | "nome" | "email" | "telefone" | "mensagem" | "consentimento", string>
>;

const OPCOES: { valor: Assunto; titulo: string; descricao: string }[] = [
  { valor: "oracao", titulo: "Pedido de oração", descricao: "Queremos orar por você." },
  { valor: "contato", titulo: "Contato ou dúvida", descricao: "Fale com a nossa equipe." },
  {
    valor: "novidades",
    titulo: "Receber novidades",
    descricao: "Informações e atualizações da igreja.",
  },
];

const inputClass =
  "mt-1 w-full rounded-lg border border-night-800/60 bg-white px-4 py-2.5 text-base text-night-900 focus:border-terra-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-terra-600 aria-[invalid=true]:border-red-700 sm:text-sm";
const errorClass = "mt-1 text-sm font-medium text-red-700";

const FIELD_ORDER: (keyof FieldErrors)[] = [
  "assunto",
  "nome",
  "email",
  "telefone",
  "mensagem",
  "consentimento",
];

function validar(form: HTMLFormElement): FieldErrors {
  const data = new FormData(form);
  const get = (k: string) => String(data.get(k) || "").trim();
  const e: FieldErrors = {};
  const assunto = get("assunto");
  if (!["oracao", "contato", "novidades"].includes(assunto)) {
    e.assunto = "Escolha o assunto.";
  }
  if (get("nome").length < 3) e.nome = "Informe seu nome completo.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("email"))) {
    e.email = "Informe um e-mail válido.";
  }
  const tel = get("telefone");
  if (tel && tel.replace(/\D/g, "").length < 10) {
    e.telefone = "Informe com DDD, ou deixe em branco.";
  }
  if (assunto !== "novidades" && get("mensagem").length < 5) {
    e.mensagem =
      assunto === "oracao" ? "Escreva o seu pedido de oração." : "Escreva a sua mensagem.";
  }
  if (get("consentimento") !== "sim") {
    e.consentimento = "Para enviar, é preciso concordar com o uso dos dados.";
  }
  return e;
}

const SUCESSO: Record<Assunto, { titulo: string; texto: string }> = {
  oracao: {
    titulo: "Recebemos o seu pedido de oração.",
    texto: "Nossa equipe vai orar por você. Enviamos uma confirmação para o seu e-mail.",
  },
  contato: {
    titulo: "Mensagem enviada!",
    texto: "Vamos responder o mais breve possível. Enviamos uma confirmação para o seu e-mail.",
  },
  novidades: {
    titulo: "Pronto, você está na lista!",
    texto:
      "Vamos enviar informações e atualizações da Nova Terra para o seu e-mail.",
  },
};

export default function ContatoForm() {
  const [state, setState] = useState<ContatoState>({ status: "idle" });
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [assunto, setAssunto] = useState<Assunto | "">("");
  const [renderizadoEm, setRenderizadoEm] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Pré-seleciona o assunto por /fale-conosco?assunto=oracao (links do site).
  const param = useSearchParams().get("assunto");
  useEffect(() => {
    if (param === "oracao" || param === "contato" || param === "novidades") {
      setAssunto(param);
    }
  }, [param]);

  useEffect(() => {
    setRenderizadoEm(String(Date.now()));
  }, []);

  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
  }, [state.status]);

  function focusField(name: keyof FieldErrors) {
    const el = formRef.current?.elements.namedItem(name === "assunto" ? "assunto" : name);
    const target = el instanceof RadioNodeList ? (el[0] as HTMLElement) : (el as HTMLElement | null);
    target?.focus();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPending) return;
    const form = e.currentTarget;
    const found = validar(form);
    setErrors(found);
    const first = FIELD_ORDER.find((k) => found[k]);
    if (first) {
      setState({ status: "idle" });
      focusField(first);
      return;
    }
    const data = new FormData(form);
    startTransition(async () => {
      const result = await enviarContato(state, data);
      setState(result);
      if (result.status === "success") {
        form.reset();
        setAssunto("");
      }
    });
  }

  if (state.status === "success") {
    const msg = SUCESSO[state.assunto ?? "contato"];
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border border-terra-100 bg-terra-50/60 p-8 text-center focus:outline-none"
      >
        <p className="font-serif text-xl font-semibold text-night-900">{msg.titulo}</p>
        <p className="mt-2 text-sm leading-relaxed text-night-800">{msg.texto}</p>
        <button
          type="button"
          onClick={() => setState({ status: "idle" })}
          className="mt-5 min-h-[44px] rounded-full border border-terra-200 px-5 py-2.5 text-sm font-semibold text-night-800 transition hover:bg-terra-50"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  const erroMsg = (name: keyof FieldErrors) =>
    errors[name] ? (
      <p id={`erro-${name}`} className={errorClass}>
        {errors[name]}
      </p>
    ) : null;

  const fieldProps = (name: keyof FieldErrors) => ({
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name] ? `erro-${name}` : undefined,
    className: inputClass,
  });

  const mensagemRotulo =
    assunto === "oracao"
      ? "Seu pedido de oração"
      : assunto === "novidades"
        ? "Quer nos contar algo? (opcional)"
        : "Sua mensagem";

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-busy={isPending}
      className="space-y-5"
    >
      <fieldset aria-describedby={errors.assunto ? "erro-assunto" : undefined}>
        <legend className="block text-sm font-medium text-night-900">
          Sobre o que você quer falar?
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {OPCOES.map((o) => (
            <label
              key={o.valor}
              className="flex min-h-[44px] cursor-pointer flex-col rounded-xl border border-night-800/30 bg-white p-3 text-sm transition hover:border-terra-600 has-[:checked]:border-terra-600 has-[:checked]:bg-terra-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-terra-600"
            >
              <span className="flex items-center gap-2 font-semibold text-night-900">
                <input
                  type="radio"
                  name="assunto"
                  value={o.valor}
                  checked={assunto === o.valor}
                  onChange={() => setAssunto(o.valor)}
                  className="h-4 w-4 accent-terra-700"
                />
                {o.titulo}
              </span>
              <span className="mt-1 pl-6 text-xs text-night-800">{o.descricao}</span>
            </label>
          ))}
        </div>
        {erroMsg("assunto")}
      </fieldset>

      <div>
        <label htmlFor="c-nome" className="block text-sm font-medium text-night-900">
          Nome completo
        </label>
        <input
          id="c-nome"
          name="nome"
          type="text"
          autoComplete="name"
          maxLength={120}
          placeholder="Seu nome completo"
          {...fieldProps("nome")}
        />
        {erroMsg("nome")}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-email" className="block text-sm font-medium text-night-900">
            E-mail
          </label>
          <input
            id="c-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={160}
            placeholder="seuemail@exemplo.com"
            {...fieldProps("email")}
          />
          {erroMsg("email")}
        </div>
        <div>
          <label htmlFor="c-telefone" className="block text-sm font-medium text-night-900">
            WhatsApp <span className="font-normal text-night-800">(opcional)</span>
          </label>
          <input
            id="c-telefone"
            name="telefone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={30}
            placeholder="(91) 90000-0000"
            {...fieldProps("telefone")}
          />
          {erroMsg("telefone")}
        </div>
      </div>

      <div>
        <label htmlFor="c-mensagem" className="block text-sm font-medium text-night-900">
          {mensagemRotulo}
        </label>
        <textarea
          id="c-mensagem"
          name="mensagem"
          rows={5}
          maxLength={2000}
          placeholder={
            assunto === "oracao"
              ? "Conte pelo que podemos orar."
              : "Escreva aqui."
          }
          {...fieldProps("mensagem")}
        />
        {erroMsg("mensagem")}
      </div>

      {/* Campo isca (robôs) e horário de renderização: validados no servidor. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="c-empresa-site">Não preencha este campo</label>
        <input
          id="c-empresa-site"
          name="empresa_site"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input type="hidden" name="t" value={renderizadoEm} />

      <div>
        <label className="flex items-start gap-3 text-sm text-night-900">
          <input
            type="checkbox"
            name="consentimento"
            value="sim"
            aria-describedby={errors.consentimento ? "erro-consentimento" : undefined}
            aria-invalid={errors.consentimento ? true : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-terra-700"
          />
          <span>
            Autorizo a Igreja Nova Terra a usar meus dados para responder a este
            contato e, se eu escolhi receber novidades, enviar informações e
            atualizações. Li a{" "}
            <Link
              href="/politica-de-privacidade"
              target="_blank"
              className="font-semibold text-terra-800 underline underline-offset-2"
            >
              Política de Privacidade
            </Link>
            .
          </span>
        </label>
        {erroMsg("consentimento")}
      </div>

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
        className="min-h-[48px] w-full rounded-full bg-terra-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-terra-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-900 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
}
