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

        <h2 className="font-serif text-lg font-semibold text-night-900">
          1. Quais dados coletamos
        </h2>
        <p>
          Coletamos apenas os dados fornecidos voluntariamente por você em
          nossos formulários — como nome, telefone/WhatsApp e e-mail — ao
          pedir oração, solicitar participação em uma Rede, entrar em
          contato ou apoiar o projeto Casa Amarela.
        </p>

        <h2 className="font-serif text-lg font-semibold text-night-900">
          2. Como usamos seus dados
        </h2>
        <p>
          Usamos seus dados exclusivamente para responder seu contato,
          organizar sua participação em atividades da igreja e, quando
          autorizado, comunicar novidades e eventos. Não vendemos nem
          compartilhamos seus dados com terceiros para fins comerciais.
        </p>

        <h2 className="font-serif text-lg font-semibold text-night-900">
          3. Dados sensíveis
        </h2>
        <p>
          Ao se cadastrar como membro, dados relacionados à convicção
          religiosa podem ser tratados como categoria sensível pela LGPD.
          Esses dados são tratados com cuidado redobrado, acesso restrito à
          liderança responsável e nunca são publicados sem consentimento.
        </p>

        <h2 className="font-serif text-lg font-semibold text-night-900">
          4. Seus direitos
        </h2>
        <p>
          Você pode solicitar, a qualquer momento, a confirmação, o acesso,
          a correção ou a exclusão dos seus dados pessoais, entrando em
          contato pelo e-mail {site.email}.
        </p>

        <h2 className="font-serif text-lg font-semibold text-night-900">
          5. Contato
        </h2>
        <p>
          Dúvidas sobre esta política podem ser enviadas para {site.email}{" "}
          ou pelo WhatsApp {site.whatsappDisplay}.
        </p>

        <p className="text-xs text-night-800/75">
          Última atualização: a definir no lançamento oficial do site.
        </p>
      </article>
    </>
  );
}
