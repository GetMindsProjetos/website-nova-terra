import { site } from "@/lib/site";
import { formatDataEvento, formatPreco, type Evento } from "@/lib/eventos";

// Templates de e-mail: HTML com estilos inline (clientes de e-mail ignoram
// <style>/Tailwind) e versão em texto puro. Todo dado vindo do usuário passa
// por esc() para evitar injeção de HTML.

const COR = {
  terra: "#cf5307", // terra-700: contraste AA com texto branco
  texto: "#28241f",
  suave: "#6b645c",
  fundo: "#fff6f0",
  borda: "#fdd0b5",
};

export function esc(valor: string) {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function layout(titulo: string, corpoHtml: string) {
  return `<!doctype html>
<html lang="pt-BR">
<body style="margin:0;padding:0;background:${COR.fundo};font-family:Arial,Helvetica,sans-serif;color:${COR.texto};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${COR.fundo};padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid ${COR.borda};border-radius:12px;overflow:hidden;">
        <tr><td style="background:${COR.terra};padding:20px 24px;color:#ffffff;font-size:18px;font-weight:bold;">${esc(site.name)}</td></tr>
        <tr><td style="padding:24px;font-size:15px;line-height:1.6;">
          <h1 style="margin:0 0 16px;font-size:20px;color:${COR.texto};">${esc(titulo)}</h1>
          ${corpoHtml}
        </td></tr>
        <tr><td style="padding:16px 24px;border-top:1px solid ${COR.borda};font-size:12px;color:${COR.suave};">
          ${esc(site.fullName)} · ${esc(site.address)}<br>
          WhatsApp ${esc(site.whatsappDisplay)} · ${esc(site.email)}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function linhasEvento(evento: Evento) {
  const itens: { rotulo: string; valor: string }[] = [];
  if (evento.dataEvento) {
    itens.push({ rotulo: "Data", valor: formatDataEvento(evento.dataEvento) });
  }
  if (evento.horaEvento) {
    itens.push({ rotulo: "Horário", valor: evento.horaEvento });
  }
  if (evento.palestrante) {
    itens.push({ rotulo: "Palestrante", valor: evento.palestrante });
  }
  itens.push({ rotulo: "Local", valor: `${site.name} — ${site.address}` });
  itens.push({
    rotulo: "Investimento",
    valor:
      evento.gratuito || evento.preco === null
        ? "Gratuito"
        : formatPreco(evento.preco),
  });
  return itens;
}

export type DadosInscricao = {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  membro: boolean;
  segmento: string | null;
};

/** Confirmação enviada a quem se inscreveu. */
export function confirmacaoInscricao(evento: Evento, dados: DadosInscricao) {
  const primeiroNome = dados.nome.split(/\s+/)[0] || dados.nome;
  const itens = linhasEvento(evento);

  const html = layout(
    "Inscrição confirmada",
    `<p style="margin:0 0 16px;">Olá, <strong>${esc(primeiroNome)}</strong>! Recebemos a sua inscrição em <strong>${esc(evento.titulo)}</strong>. Estamos felizes em receber você.</p>
     <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;background:${COR.fundo};border:1px solid ${COR.borda};border-radius:8px;margin:0 0 16px;">
       ${itens
         .map(
           (i) =>
             `<tr><td style="padding:8px 14px;font-size:13px;color:${COR.suave};width:110px;vertical-align:top;">${esc(i.rotulo)}</td><td style="padding:8px 14px;font-size:14px;">${esc(i.valor)}</td></tr>`
         )
         .join("")}
     </table>
     <p style="margin:0 0 8px;">Se precisar alterar algo ou tiver alguma dúvida, é só responder a este e-mail ou falar com a gente no WhatsApp ${esc(site.whatsappDisplay)}.</p>
     <p style="margin:0;">Que Deus abençoe!</p>`
  );

  const text = [
    `Olá, ${primeiroNome}! Recebemos a sua inscrição em ${evento.titulo}.`,
    "",
    ...itens.map((i) => `${i.rotulo}: ${i.valor}`),
    "",
    `Dúvidas? Responda este e-mail ou chame no WhatsApp ${site.whatsappDisplay}.`,
    "Que Deus abençoe!",
    "",
    `${site.fullName} — ${site.address}`,
  ].join("\n");

  return {
    subject: `Inscrição confirmada: ${evento.titulo}`,
    html,
    text,
  };
}

/** Aviso interno para a equipe da igreja a cada nova inscrição. */
export function avisoNovaInscricao(evento: Evento, dados: DadosInscricao) {
  const campos: { rotulo: string; valor: string }[] = [
    { rotulo: "Nome", valor: dados.nome },
    { rotulo: "E-mail", valor: dados.email },
    { rotulo: "WhatsApp", valor: dados.telefone },
    { rotulo: "Endereço", valor: dados.endereco },
    { rotulo: "É membro", valor: dados.membro ? "Sim" : "Não" },
  ];
  if (dados.segmento) {
    campos.push({ rotulo: "Segmento", valor: dados.segmento });
  }

  const html = layout(
    "Nova inscrição recebida",
    `<p style="margin:0 0 16px;">Evento: <strong>${esc(evento.titulo)}</strong></p>
     <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;background:${COR.fundo};border:1px solid ${COR.borda};border-radius:8px;">
       ${campos
         .map(
           (c) =>
             `<tr><td style="padding:8px 14px;font-size:13px;color:${COR.suave};width:110px;vertical-align:top;">${esc(c.rotulo)}</td><td style="padding:8px 14px;font-size:14px;">${esc(c.valor)}</td></tr>`
         )
         .join("")}
     </table>
     <p style="margin:16px 0 0;font-size:13px;color:${COR.suave};">A lista completa está em Admin › Inscritos.</p>`
  );

  const text = [
    `Nova inscrição em ${evento.titulo}`,
    "",
    ...campos.map((c) => `${c.rotulo}: ${c.valor}`),
  ].join("\n");

  return {
    subject: `Nova inscrição: ${dados.nome.replace(/\s+/g, " ")} — ${evento.titulo}`,
    html,
    text,
  };
}

export type AssuntoContato = "oracao" | "contato" | "novidades";

export const ROTULO_ASSUNTO: Record<AssuntoContato, string> = {
  oracao: "Pedido de oração",
  contato: "Contato / dúvida",
  novidades: "Receber informações e atualizações",
};

export type DadosContato = {
  assunto: AssuntoContato;
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
};

const comQuebras = (texto: string) => esc(texto).replace(/\r?\n/g, "<br>");
const semQuebras = (texto: string) => texto.replace(/\s+/g, " ").trim();

/** Aviso interno: chega em acolhimento@ com Reply-To no visitante. */
export function avisoContato(d: DadosContato) {
  const campos = [
    { rotulo: "Assunto", valor: ROTULO_ASSUNTO[d.assunto] },
    { rotulo: "Nome", valor: d.nome },
    { rotulo: "E-mail", valor: d.email },
    { rotulo: "WhatsApp", valor: d.telefone || "(não informado)" },
  ];

  const html = layout(
    ROTULO_ASSUNTO[d.assunto],
    `<table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;background:${COR.fundo};border:1px solid ${COR.borda};border-radius:8px;margin:0 0 16px;">
       ${campos
         .map(
           (c) =>
             `<tr><td style="padding:8px 14px;font-size:13px;color:${COR.suave};width:110px;vertical-align:top;">${esc(c.rotulo)}</td><td style="padding:8px 14px;font-size:14px;">${esc(c.valor)}</td></tr>`
         )
         .join("")}
     </table>
     ${
       d.mensagem
         ? `<p style="margin:0 0 6px;font-size:13px;color:${COR.suave};">Mensagem</p>
            <p style="margin:0;padding:12px 14px;background:${COR.fundo};border-left:3px solid ${COR.terra};border-radius:4px;">${comQuebras(d.mensagem)}</p>`
         : ""
     }
     <p style="margin:16px 0 0;font-size:13px;color:${COR.suave};">Para responder, use "Responder": o Reply-To é o e-mail da pessoa.</p>`
  );

  const text = [
    `Assunto: ${ROTULO_ASSUNTO[d.assunto]}`,
    ...campos.slice(1).map((c) => `${c.rotulo}: ${c.valor}`),
    ...(d.mensagem ? ["", "Mensagem:", d.mensagem] : []),
  ].join("\n");

  const tag = { oracao: "Oração", contato: "Contato", novidades: "Novidades" }[d.assunto];
  return { subject: `[${tag}] ${semQuebras(d.nome)}`, html, text };
}

/** Confirmação curta para quem enviou (sem links, para não servir de abuso). */
export function confirmacaoContato(d: DadosContato) {
  const primeiroNome = semQuebras(d.nome).split(" ")[0] || d.nome;
  const frase = {
    oracao:
      "Recebemos o seu pedido de oração. Nossa equipe estará orando por você.",
    contato:
      "Recebemos a sua mensagem e vamos responder o mais breve possível.",
    novidades:
      "Você está na nossa lista para receber informações e atualizações da Igreja Nova Terra.",
  }[d.assunto];

  const html = layout(
    "Recebemos a sua mensagem",
    `<p style="margin:0 0 16px;">Olá, <strong>${esc(primeiroNome)}</strong>!</p>
     <p style="margin:0 0 16px;">${esc(frase)}</p>
     <p style="margin:0 0 16px;">Se precisar falar com a gente, é só responder a este e-mail ou chamar no WhatsApp ${esc(site.whatsappDisplay)}.</p>
     <p style="margin:0;font-size:13px;color:${COR.suave};">Se você não fez este pedido, pode ignorar esta mensagem.</p>`
  );

  const text = [
    `Olá, ${primeiroNome}!`,
    "",
    frase,
    "",
    `Para falar com a gente: responda este e-mail ou chame no WhatsApp ${site.whatsappDisplay}.`,
    "Se você não fez este pedido, pode ignorar esta mensagem.",
    "",
    `${site.fullName} — ${site.address}`,
  ].join("\n");

  return { subject: "Recebemos a sua mensagem — Igreja Nova Terra", html, text };
}
