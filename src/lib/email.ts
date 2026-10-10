import "server-only";

// Envio de e-mail transacional pela API da Resend (server-only; a chave
// RESEND_API_KEY nunca vai para o navegador). Sem SDK: um único fetch.
//
// Variáveis de ambiente:
//   RESEND_API_KEY   obrigatória para enviar (sem ela, o envio é ignorado)
//   EMAIL_FROM       opcional; padrão "Igreja Nova Terra <acolhimento@...>"
//   EMAIL_NOTIFY_TO  opcional; para onde vão os avisos internos (padrão: site.email)

import { site } from "@/lib/site";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export const EMAIL_FROM =
  process.env.EMAIL_FROM || `${site.name} <${site.email}>`;

export const EMAIL_NOTIFY_TO = process.env.EMAIL_NOTIFY_TO || site.email;

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type SendEmailResult =
  | { ok: true; id: string | null }
  | { ok: false; skipped?: boolean; error: string };

/**
 * Nunca lança: e-mail é efeito colateral e não pode derrubar a inscrição.
 * Quem chama decide o que fazer com `ok: false` (aqui, só registrar no log).
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY ausente: e-mail não enviado.");
    return { ok: false, skipped: true, error: "RESEND_API_KEY ausente" };
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
        reply_to: input.replyTo ?? site.email,
      }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });

    if (!res.ok) {
      const detalhe = await res.text().catch(() => "");
      console.error(`[email] Resend respondeu ${res.status}: ${detalhe}`);
      return { ok: false, error: `HTTP ${res.status}` };
    }

    const body = (await res.json().catch(() => null)) as { id?: string } | null;
    return { ok: true, id: body?.id ?? null };
  } catch (err) {
    console.error("[email] Falha ao chamar a Resend:", err);
    return { ok: false, error: err instanceof Error ? err.message : "erro" };
  }
}
