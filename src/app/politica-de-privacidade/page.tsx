import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";

import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Política de Privacidade",
  description:
    "Política de Privacidade da Igreja Nova Terra: quais dados coletamos, como os usamos, dados sensíveis e seus direitos, conforme a LGPD.",
  path: "/politica-de-privacidade",
});

export default function PrivacidadePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Início", path: "/" },
          { name: "Política de Privacidade", path: "/politica-de-privacidade" },
        ])}
      />
      <PageHero eyebrow="Legal" title="Política de Privacidade" />
      <article className="mx-auto max-w-3xl space-y-6 px-4 py-14 sm:py-20 text-sm leading-relaxed text-night-800/80 sm:px-6">
        <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/60 p-5 text-xs italic text-amber-700">
          Minuta inicial para orientar o desenvolvimento do site. Deve ser
          revisada e aprovada pela liderança da igreja (e, idealmente, por
          um profissional jurídico) antes do lançamento oficial, conforme
          indicado no documento de briefing do projeto.
        </div>

        <p>
          A {site.fullName} (&quot;Nova Terra&quot;) respeita a privacidade
          de quem visita este site e preza pela proteção dos dados pessoais
          de membros, congregantes e visitantes, em conformidade com a Lei
          Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
        </p>

        <h2 className="font-serif text-lg font-medium text-night-900">
          1. Quais dados coletamos
        </h2>
        <p>
          Coletamos os dados que você informa voluntariamente nos formulários
          do site:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Inscrição em eventos:</strong> nome, e-mail,
            telefone/WhatsApp, endereço, se é membro da igreja e, nos eventos
            para empreendedores, o segmento em que atua.
          </li>
          <li>
            <strong>Fale Conosco:</strong> nome, e-mail, telefone/WhatsApp
            (opcional), o assunto escolhido (pedido de oração, contato ou
            dúvida, ou receber novidades) e a mensagem que você escrever.
          </li>
        </ul>
        <p>
          Também registramos dados de navegação de forma agregada, como
          páginas visitadas e tipo de dispositivo, por meio do Google
          Analytics, que pode usar cookies. Você pode bloquear ou apagar
          cookies nas configurações do seu navegador.
        </p>

        <h2 className="font-serif text-lg font-medium text-night-900">
          2. Como usamos seus dados
        </h2>
        <p>
          Usamos seus dados para responder seu contato, orar pelos pedidos
          recebidos, organizar sua participação em eventos e atividades da
          igreja e, quando você escolher receber novidades, enviar
          informações e atualizações. Ao enviar um formulário, você recebe um
          e-mail de confirmação. Não vendemos nem compartilhamos seus dados
          com terceiros para fins comerciais.
        </p>

        <h2 className="font-serif text-lg font-medium text-night-900">
          3. Dados sensíveis
        </h2>
        <p>
          Pedidos de oração e a condição de membro da igreja revelam
          convicção religiosa, que a LGPD trata como categoria sensível.
          Esses dados são usados apenas para a finalidade informada, com
          acesso restrito à equipe e à liderança responsável, e nunca são
          publicados sem o seu consentimento.
        </p>

        <h2 className="font-serif text-lg font-medium text-night-900">
          4. Quem trata os dados por nós
        </h2>
        <p>
          Para manter o site funcionando, usamos prestadores que tratam dados
          em nosso nome: hospedagem do site (Vercel), banco de dados das
          inscrições (Supabase), envio de e-mails de confirmação e de
          mensagens (Resend), hospedagem da caixa de e-mail da igreja e
          estatísticas de acesso (Google Analytics). Alguns deles podem
          armazenar ou processar dados fora do Brasil.
        </p>

        <h2 className="font-serif text-lg font-medium text-night-900">
          5. Seus direitos
        </h2>
        <p>
          Você pode solicitar, a qualquer momento, a confirmação, o acesso,
          a correção ou a exclusão dos seus dados pessoais, entrando em
          contato pelo e-mail {site.email}. Para deixar de receber
          novidades, basta pedir por esse mesmo e-mail.
        </p>

        <h2 className="font-serif text-lg font-medium text-night-900">
          6. Contato
        </h2>
        <p>
          Dúvidas sobre esta política podem ser enviadas para {site.email}{" "}
          ou pelo WhatsApp {site.whatsappDisplay}.
        </p>

        <p className="text-xs text-night-800/75">
          Última atualização: 10 de outubro de 2026. Texto em minuta, pendente
          de revisão pela liderança da igreja.
        </p>
      </article>
    </>
  );
}
