import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CTAButton from "@/components/CTAButton";
import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Nossa Fé",
  description:
    "O que a Igreja Nova Terra crê: a Bíblia como regra de fé e de vida, um só Deus em três pessoas, a salvação em Jesus Cristo e a vida em comunidade.",
  path: "/quem-somos/fe",
});

const cremos = [
  "Cremos na Bíblia Sagrada como única regra infalível de fé e de vida.",
  "Cremos em um só Deus, eternamente subsistente em três pessoas: Pai, Filho e Espírito Santo.",
  "Cremos na salvação por meio de Jesus Cristo e no batismo em água, por imersão, como testemunho público dessa decisão.",
  "Vivemos nossa fé em comunidade, através de Redes de discipulado, serviço e cuidado mútuo.",
];

export default function FePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Início", path: "/" },
          { name: "Quem Somos", path: "/quem-somos" },
          { name: "Nossa Fé", path: "/quem-somos/fe" },
        ])}
      />
      <PageHero eyebrow="Quem Somos" title="Nossa Fé" />
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <ul className="space-y-4">
          {cremos.map((item) => (
            <li key={item} className="flex gap-3 rounded-xl border border-terra-100 bg-white p-5 shadow-sm">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-terra-600" />
              <p className="leading-relaxed text-night-800/80">{item}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <CTAButton href="/redes">Conheça as Redes</CTAButton>
          <CTAButton href="/fale-conosco" variant="secondary">
            Fale conosco
          </CTAButton>
        </div>
      </article>
    </>
  );
}
