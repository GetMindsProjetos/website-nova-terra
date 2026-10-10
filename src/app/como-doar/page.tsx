import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CTAButton from "@/components/CTAButton";
import CopyPixButton from "@/components/CopyPixButton";
import { site, whatsappLink } from "@/lib/site";
import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Como Doar",
  description:
    "Três formas de contribuir com a Igreja Nova Terra: dízimos e ofertas, o projeto Casa Amarela, ou servindo numa Rede.",
  path: "/como-doar",
});

export default function ComoDoarPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Início", path: "/" },
          { name: "Como Doar", path: "/como-doar" },
        ])}
      />
      <PageHero
        eyebrow="Como Doar"
        title="Três formas de contribuir"
        description="O tempo, os talentos e os recursos que você oferece sustentam a missão da Nova Terra e do Casa Amarela."
      />
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="space-y-6">
          <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-lg font-semibold text-night-900">
              1. Dízimos e ofertas
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-night-800/70">
              O sustento da igreja e de sua missão acontece através dos
              dízimos e ofertas dos membros. Contribua via PIX:
            </p>

            <div className="mt-5 flex flex-col items-center gap-6 rounded-xl bg-terra-50/60 p-6 sm:flex-row sm:items-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={site.pix.qrcode}
                alt="QR Code para doação via PIX"
                width={180}
                height={180}
                className="h-[180px] w-[180px] rounded-lg bg-white p-2 shadow-sm"
              />
              <div className="flex-1 text-center sm:text-left">
                <dl className="space-y-2 text-sm text-night-800/80">
                  <div>
                    <dt className="font-semibold text-night-900">
                      Chave PIX ({site.pix.tipoChave})
                    </dt>
                    <dd>{site.pix.chave}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-night-900">Nome</dt>
                    <dd>{site.pix.nome}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-night-900">Banco</dt>
                    <dd>{site.pix.banco}</dd>
                  </div>
                </dl>
                <div className="mt-4">
                  <CopyPixButton chave={site.pix.chave} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-lg font-semibold text-night-900">
              2. Casa Amarela
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-night-800/70">
              Doações e voluntariado para o projeto social de apoio a
              mulheres em vulnerabilidade em Icoaraci.
            </p>
            <div className="mt-3">
              <CTAButton href="/casa-amarela" variant="secondary">
                Conheça o Casa Amarela
              </CTAButton>
            </div>
          </div>

          <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-lg font-semibold text-night-900">
              3. Sirva numa Rede
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-night-800/70">
              O tempo e os talentos também são uma forma de doação. Encontre
              a Rede certa para você entre as 17 frentes de serviço da
              igreja.
            </p>
            <div className="mt-3">
              <CTAButton href="/redes" variant="secondary">
                Ver todas as Redes
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <CTAButton href={whatsappLink("Olá! Quero saber mais sobre como ajudar a Nova Terra.")} external>
            Falar com a igreja
          </CTAButton>
        </div>
      </section>
    </>
  );
}
