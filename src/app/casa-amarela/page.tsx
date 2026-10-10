import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CTAButton from "@/components/CTAButton";
import CopyPixButton from "@/components/CopyPixButton";
import Lacuna from "@/components/Lacuna";
import { site, whatsappLink } from "@/lib/site";
import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Projeto Casa Amarela",
  description:
    "Casa Amarela: projeto voluntário da Igreja Nova Terra com apoio emocional, educacional e capacitação para mulheres de Icoaraci, Belém-PA.",
  path: "/casa-amarela",
});

const ofertas = [
  {
    title: "Aconselhamento e apoio emocional",
    desc: "Atendimento de terapeutas e psicólogos voluntários.",
  },
  {
    title: "Apoio educacional",
    desc: "Aulas de reforço, apoio em lições escolares, preparação para provas e orientação acadêmica.",
  },
  {
    title: "Capacitação prática",
    desc: "Workshops de habilidades voltados à entrada no mercado de trabalho.",
  },
];

export default function CasaAmarelaPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Início", path: "/" },
          { name: "Projeto Casa Amarela", path: "/casa-amarela" },
        ])}
      />
      <PageHero
        eyebrow="Projetos Sociais"
        title="Casa Amarela — cuidado real para mulheres de Icoaraci"
        description="Um projeto voluntário da Igreja Nova Terra dedicado a oferecer suporte emocional, educacional e social para mulheres em situação de vulnerabilidade em Icoaraci. Desde maio de 2024, funciona inteiramente com voluntários e doações — sem fins lucrativos."
      >
        <CTAButton href={whatsappLink("Olá! Quero ajudar o Casa Amarela.")} external>
          Quero ajudar o Casa Amarela
        </CTAButton>
      </PageHero>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <h2 className="font-serif text-2xl font-bold text-night-900">
          O que oferecemos
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ofertas.map((o) => (
            <div key={o.title} className="rounded-2xl border border-terra-100 bg-gradient-to-br from-terra-100 via-terra-50 to-white p-6 shadow-sm">
              <h3 className="font-serif text-base font-semibold text-night-900">{o.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-night-800/70">{o.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-14 font-serif text-2xl font-bold text-night-900">
          Como ajudar
        </h2>
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-terra-100 bg-terra-50/60 p-5">
            <p className="font-semibold text-night-900">Doe materiais e produtos</p>
            <Lacuna>lista específica do que é aceito como doação</Lacuna>
          </div>
          <div className="rounded-xl border border-terra-100 bg-terra-50/60 p-5">
            <p className="font-semibold text-night-900">Seja voluntário(a)</p>
            <p className="text-sm text-night-800/70">
              Profissionais de psicologia, terapia, educação e áreas afins.
            </p>
            <Lacuna>canal de inscrição para voluntários</Lacuna>
          </div>
          <div className="rounded-xl border border-terra-100 bg-terra-50/60 p-5">
            <p className="font-semibold text-night-900">Contribua financeiramente</p>
            <div className="mt-3 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={site.pix.qrcode}
                alt="QR Code para doação via PIX"
                width={140}
                height={140}
                className="h-[140px] w-[140px] rounded-lg bg-white p-2 shadow-sm"
              />
              <div className="text-center sm:text-left">
                <p className="text-sm text-night-800/80">
                  <span className="font-semibold text-night-900">
                    Chave PIX ({site.pix.tipoChave}):
                  </span>{" "}
                  {site.pix.chave}
                </p>
                <p className="text-sm text-night-800/80">
                  <span className="font-semibold text-night-900">Nome:</span>{" "}
                  {site.pix.nome}
                </p>
                <p className="text-sm text-night-800/80">
                  <span className="font-semibold text-night-900">Banco:</span>{" "}
                  {site.pix.banco}
                </p>
                <div className="mt-3">
                  <CopyPixButton chave={site.pix.chave} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <CTAButton href={whatsappLink("Olá! Quero ajudar o Casa Amarela.")} external>
            Quero ajudar o Casa Amarela
          </CTAButton>
        </div>
      </section>
    </>
  );
}
