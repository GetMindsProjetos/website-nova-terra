"use server";

import { headers } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getEventoBySlug } from "@/lib/eventos";
import { sendEmail, EMAIL_NOTIFY_TO } from "@/lib/email";
import {
  avisoNovaInscricao,
  confirmacaoInscricao,
} from "@/lib/emailTemplates";

export type InscricaoState = {
  status: "idle" | "success" | "error";
  message?: string;
};

function limparTelefone(telefone: string) {
  return telefone.replace(/\D/g, "");
}

// Lê um campo só se for string (rejeita File/ausente) e aplica trim.
function lerTexto(formData: FormData, nome: string): string | null {
  const valor = formData.get(nome);
  if (valor === null) return "";
  return typeof valor === "string" ? valor.trim() : null;
}

// Limitação de taxa simples em memória: 5 envios / 60 s por IP + evento.
// Atenção: em serverless (Vercel) o Map vive por instância, então é uma
// mitigação parcial contra abuso casual, não um controle global.
const JANELA_MS = 60_000;
const MAX_POR_JANELA = 5;
const MAX_CHAVES = 5_000;
const tentativas = new Map<string, number[]>();

function excedeuLimite(chave: string): boolean {
  const agora = Date.now();
  if (tentativas.size > MAX_CHAVES) {
    for (const [k, ts] of tentativas) {
      if (ts.every((t) => agora - t >= JANELA_MS)) tentativas.delete(k);
    }
    if (tentativas.size > MAX_CHAVES) tentativas.clear();
  }
  const recentes = (tentativas.get(chave) ?? []).filter(
    (t) => agora - t < JANELA_MS
  );
  if (recentes.length >= MAX_POR_JANELA) {
    tentativas.set(chave, recentes);
    return true;
  }
  recentes.push(agora);
  tentativas.set(chave, recentes);
  return false;
}

async function ipDoCliente(): Promise<string> {
  try {
    const h = await headers();
    const xff = h.get("x-forwarded-for");
    const ip = xff?.split(",")[0]?.trim() || h.get("x-real-ip")?.trim();
    return ip ? ip.slice(0, 64) : "desconhecido";
  } catch {
    return "desconhecido";
  }
}

export async function inscreverEmEvento(
  _prevState: InscricaoState,
  formData: FormData
): Promise<InscricaoState> {
  // Honeypot opcional: se o campo existir e vier preenchido, finge sucesso
  // sem gravar (o formulário atual não tem o campo; ausência é aceita).
  const armadilha = formData.get("website");
  if (typeof armadilha === "string" && armadilha.trim() !== "") {
    return { status: "success" };
  }

  const eventoSlugRaw = lerTexto(formData, "eventoSlug");
  const nomeRaw = lerTexto(formData, "nome");
  const emailRaw = lerTexto(formData, "email");
  const telefoneRaw = lerTexto(formData, "telefone");
  const enderecoRaw = lerTexto(formData, "endereco");
  const membroRaw = lerTexto(formData, "membro");
  const segmentoRaw = lerTexto(formData, "segmento");

  if (
    eventoSlugRaw === null ||
    nomeRaw === null ||
    emailRaw === null ||
    telefoneRaw === null ||
    enderecoRaw === null ||
    membroRaw === null ||
    segmentoRaw === null ||
    eventoSlugRaw.length > 120
  ) {
    return {
      status: "error",
      message: "Não foi possível processar sua inscrição. Revise os dados.",
    };
  }

  const eventoSlug = eventoSlugRaw;
  const nome = nomeRaw;
  const email = emailRaw;
  const telefone = telefoneRaw;
  const endereco = enderecoRaw;
  const segmento = segmentoRaw;

  if (excedeuLimite(`${await ipDoCliente()}|${eventoSlug}`)) {
    return {
      status: "error",
      message:
        "Muitas tentativas em pouco tempo. Aguarde um minuto e tente novamente.",
    };
  }

  const evento = await getEventoBySlug(eventoSlug);
  if (!evento) {
    return { status: "error", message: "Evento não encontrado." };
  }

  if (!nome || nome.length < 3) {
    return { status: "error", message: "Informe seu nome completo." };
  }
  if (nome.length > 120) {
    return { status: "error", message: "O nome deve ter até 120 caracteres." };
  }
  const emailRegex =
    /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
  if (!email || email.length > 254 || !emailRegex.test(email)) {
    return { status: "error", message: "Informe um e-mail válido." };
  }
  const digitosTelefone = limparTelefone(telefone).length;
  if (telefone.length > 30 || digitosTelefone < 10 || digitosTelefone > 13) {
    return {
      status: "error",
      message: "Informe um telefone/WhatsApp válido, com DDD.",
    };
  }
  if (!endereco || endereco.length < 5) {
    return { status: "error", message: "Informe seu endereço." };
  }
  if (endereco.length > 250) {
    return {
      status: "error",
      message: "O endereço deve ter até 250 caracteres.",
    };
  }
  if (segmento.length > 120) {
    return {
      status: "error",
      message: "O segmento deve ter até 120 caracteres.",
    };
  }
  if (membroRaw !== "sim" && membroRaw !== "nao") {
    return { status: "error", message: "Informe se você é membro da igreja." };
  }
  if (evento.categoria === "empreendedores" && !segmento) {
    return {
      status: "error",
      message: "Informe o segmento em que você atua.",
    };
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return {
      status: "error",
      message:
        "As inscrições estão temporariamente indisponíveis. Tente novamente mais tarde ou fale com a gente pelo WhatsApp.",
    };
  }

  const novaInscricao = {
    evento_slug: evento.slug,
    evento_titulo: evento.titulo,
    nome,
    email,
    telefone: limparTelefone(telefone),
    endereco,
    membro: membroRaw === "sim",
    segmento: evento.categoria === "empreendedores" ? segmento : null,
  };

  // O client Supabase não tem os tipos gerados do banco (não geramos
  // Database types para este projeto), então o insert é tipado como
  // `any` aqui de propósito — os dados já foram validados acima.
  const { error } = await (supabase.from("inscricoes") as any).insert(
    novaInscricao
  );

  if (error) {
    // Sem PII: a mensagem do banco pode ecoar valores do registro.
    console.error("Erro ao gravar inscrição. code:", error.code);
    return {
      status: "error",
      message: "Não conseguimos salvar sua inscrição agora. Tente novamente em instantes.",
    };
  }

  // E-mails são efeito colateral: nunca lançam e uma falha aqui não desfaz a
  // inscrição (já gravada). Confirmação ao inscrito + aviso à equipe.
  const dados = {
    nome,
    email,
    telefone: limparTelefone(telefone),
    endereco,
    membro: membroRaw === "sim",
    segmento: evento.categoria === "empreendedores" ? segmento : null,
  };
  const confirmacao = confirmacaoInscricao(evento, dados);
  const aviso = avisoNovaInscricao(evento, dados);
  await Promise.allSettled([
    sendEmail({ to: email, ...confirmacao }),
    sendEmail({ to: EMAIL_NOTIFY_TO, replyTo: email, ...aviso }),
  ]);

  return { status: "success" };
}
