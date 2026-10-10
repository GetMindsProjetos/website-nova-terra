import { Suspense } from "react";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CTAButton from "@/components/CTAButton";
import Lacuna from "@/components/Lacuna";
import ContatoForm from "@/components/ContatoForm";
import { site, whatsappLink } from "@/lib/site";
import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Fale Conosco",
  description:
    "Fale com a Igreja Nova Terra: endereço, horários dos cultos e WhatsApp para conversar, pedir oração ou visitar, em Icoaraci, Belém-PA.",
  path: "/fale-conosco",
});

export default function FaleConoscoPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Início", path: "/" },
          { name: "Fale Conosco", path: "/fale-conosco" },
        ])}
      />
      <PageHero
        eyebrow="Fale Conosco"
        title="Fale com a gente"
        description="Estamos aqui para conversar, orar com você e receber sua visita. Envie um pedido de oração, tire uma dúvida ou receba as novidades da igreja."
      />
      <section className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-lg font-semibold text-night-900">
            Endereço
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-night-800/70">
            {site.address}
          </p>

          <h2 className="mt-8 font-serif text-lg font-semibold text-night-900">
            Cultos
          </h2>
          <ul className="mt-2 space-y-1 text-sm text-night-800/70">
            {site.cultos.map((c) => (
              <li key={c.label}>
                <span className="font-medium text-night-900">{c.label}:</span>{" "}
                {c.quando}
              </li>
            ))}
          </ul>

          <h2 className="mt-8 font-serif text-lg font-semibold text-night-900">
            WhatsApp / E-mail
          </h2>
          <p className="mt-2 text-sm text-night-800/70">
            WhatsApp: {site.whatsappDisplay}
          </p>
          <p className="text-sm text-night-800/70">E-mail: {site.email}</p>
          <div className="mt-2">
            <Lacuna>link do canal no YouTube</Lacuna>
          </div>

          <div className="mt-6">
            <CTAButton href={whatsappLink("Olá! Vim pelo site da Nova Terra.")} external>
              Falar no WhatsApp
            </CTAButton>
          </div>
        </div>

        <div
          id="formulario"
          className="scroll-mt-24 rounded-2xl border border-terra-100 bg-white p-5 shadow-card sm:p-6"
        >
          <h2 className="font-serif text-xl font-bold text-night-900">
            Envie uma mensagem
          </h2>
          <p className="mt-1 text-sm text-night-800">
            Sua mensagem chega à equipe de acolhimento da igreja.
          </p>
          <div className="mt-5">
            <Suspense fallback={null}>
              <ContatoForm />
            </Suspense>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-terra-100">
          <iframe
            title="Localização da Igreja Nova Terra"
            src={`https://www.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`}
            className="h-[320px] w-full"
            loading="lazy"
          />
        </div>
      </section>
    </>
  );
}
