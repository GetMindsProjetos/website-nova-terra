import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CTAButton from "@/components/CTAButton";
import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Missão e Visão",
  description:
    "Missão: ganhar, cuidar e capacitar. Visão: tornar cada membro fruto permanente. Conheça a base bíblica da Igreja Nova Terra, em Icoaraci.",
  path: "/quem-somos/missao-e-visao",
});

export default function MissaoVisaoPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Início", path: "/" },
          { name: "Quem Somos", path: "/quem-somos" },
          { name: "Missão e Visão", path: "/quem-somos/missao-e-visao" },
        ])}
      />
      <PageHero eyebrow="Quem Somos" title="Missão e Visão" />
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl glass p-6">
            <p className="text-sm font-medium uppercase tracking-wide text-terra-800">
              Visão
            </p>
            <p className="mt-2 font-serif text-xl font-medium text-night-900">
              Tornar cada membro fruto permanente.
            </p>
          </div>
          <div className="rounded-2xl glass p-6">
            <p className="text-sm font-medium uppercase tracking-wide text-terra-800">
              Missão
            </p>
            <p className="mt-2 font-serif text-xl font-medium text-night-900">
              Ganhar, cuidar e capacitar.
            </p>
          </div>
        </div>

        <p className="mt-8 leading-relaxed text-night-800/80">
          Nossa base bíblica está em Mateus 28:18-20 — a Grande Comissão, o
          chamado a &quot;ir e fazer discípulos&quot; — e em Deuteronômio
          6:10-12, o chamado a não esquecer a Deus em meio à bênção
          recebida.
        </p>

        <blockquote className="mt-8 border-l-4 border-terra-500 pl-5 italic text-night-800/80">
          &quot;Avivamento sem multiplicação morre.&quot; Não basta um momento
          de fé — o chamado é multiplicar discípulos, geração após geração.
        </blockquote>

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
