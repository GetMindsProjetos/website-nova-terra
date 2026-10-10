"use server";

import { headers } from "next/headers";
import { sendEmail, EMAIL_NOTIFY_TO } from "@/lib/email";
import {
  avisoContato,
  confirmacaoContato,
  type AssuntoContato,
} from "@/lib/emailTemplates";

export type ContatoState = {
  status: "idle" | "success" | "error";
  message?: string;
  assunto?: AssuntoContato;
};

const ASSUNTOS: AssuntoContato[] = ["oracao", "contato", "novidades"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Limite simples por IP (memória da instância): segura robôs óbvios sem banco.
// Importante porque o plano gratuito da Resend tem teto diário e o mesmo teto
// atende as confirmações de inscrição em eventos.
const JANELA_MS = 10 * 60 * 1000;
const MAX_ENVIOS = 5;
const envios = new Map<string, number[]>();

function excedeuLimite(ip: string) {
  const agora = Date.now();
  const recentes = (envios.get(ip) ?? []).filter((t) => agora - t < JANELA_MS);
  if (recentes.length >= MAX_ENVIOS) {
    envios.set(ip, recentes);
    return true;
  }
  recentes.push(agora);
  envios.set(ip, recentes);
  if (envios.size > 5000) envios.clear();
  return false;
}

export async function enviarContato(
  _prev: ContatoState,
  formData: FormData
): Promise<ContatoState> {
  const get = (k: string) => String(formData.get(k) || "").trim();

  const assuntoRaw = get("assunto");
  const nome = get("nome");
  const email = get("email");
  const telefone = get("telefone");
  const mensagem = get("mensagem");
  const consentimento = get("consentimento") === "sim";

  // Robôs: campo isca preenchido ou envio rápido demais. Responde "sucesso"
  // sem enviar nada, para não ensinar o que foi barrado.
  const decorrido = Date.now() - Number(get("t"));
  const suspeito = get("empresa_site") !== "" || !(decorrido > 3000);
  if (suspeito) {
    return { status: "success", assunto: "contato" };
  }

  if (!ASSUNTOS.includes(assuntoRaw as AssuntoContato)) {
    return { status: "error", message: "Escolha o assunto." };
  }
  const assunto = assuntoRaw as AssuntoContato;

  if (nome.length < 3 || nome.length > 120) {
    return { status: "error", message: "Informe seu nome completo." };
  }
  if (!EMAIL_REGEX.test(email) || email.length > 160) {
    return { status: "error", message: "Informe um e-mail válido." };
  }
  if (telefone && (telefone.length > 30 || telefone.replace(/\D/g, "").length < 10)) {
    return {
      status: "error",
      message: "Informe um telefone/WhatsApp válido, com DDD, ou deixe em branco.",
    };
  }
  if (assunto !== "novidades" && mensagem.length < 5) {
    return {
      status: "error",
      message:
        assunto === "oracao"
          ? "Escreva o seu pedido de oração."
          : "Escreva a sua mensagem.",
    };
  }
  if (mensagem.length > 2000) {
    return { status: "error", message: "A mensagem está muito longa (máx. 2000 caracteres)." };
  }
  if (!consentimento) {
    return {
      status: "error",
      message: "Para enviar, é preciso concordar com o uso dos dados.",
    };
  }

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "desconhecido";
  if (excedeuLimite(ip)) {
    return {
      status: "error",
      message: "Muitas tentativas em pouco tempo. Aguarde alguns minutos ou fale pelo WhatsApp.",
    };
  }

  const dados = { assunto, nome, email, telefone, mensagem };

  // O e-mail para a igreja É o registro desta mensagem (não há banco aqui):
  // se ele falhar, o visitante precisa saber, em vez de achar que enviou.
  const aviso = avisoContato(dados);
  const entregue = await sendEmail({
    to: EMAIL_NOTIFY_TO,
    replyTo: email,
    ...aviso,
  });
  if (!entregue.ok) {
    return {
      status: "error",
      message:
        "Não conseguimos enviar agora. Tente novamente em instantes ou fale com a gente pelo WhatsApp.",
    };
  }

  // Confirmação ao visitante: efeito colateral, não pode transformar em erro.
  await sendEmail({ to: email, ...confirmacaoContato(dados) });

  return { status: "success", assunto };
}
