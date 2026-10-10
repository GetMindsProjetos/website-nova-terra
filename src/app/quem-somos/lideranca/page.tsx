import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Lacuna from "@/components/Lacuna";
import CTAButton from "@/components/CTAButton";
import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Liderança",
  description:
    "Conheça a liderança pastoral da Igreja Nova Terra, em Icoaraci, Belém-PA, fundada em 2007 pela Pastora Yracy, presidente fundadora.",
  path: "/quem-somos/lideranca",
});

export default function LiderancaPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Início", path: "/" },
          { name: "Quem Somos", path: "/quem-somos" },
          { name: "Liderança", path: "/quem-somos/lideranca" },
        ])}
      />
      <PageHero eyebrow="Quem Somos" title="Liderança" />
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="rounded-2xl glass p-8 text-center shadow-sm">
          <div className="mx-auto h-28 w-28 rounded-full bg-terra-100" aria-hidden="true" />
          <p className="mt-4 font-serif text-lg font-medium text-night-900">
            Pastora Yracy
          </p>
          <p className="text-sm text-night-800/75">
            Liderança histórica e presidente fundadora (2007)
          </p>
          <div className="mt-4 flex justify-center">
            <Lacuna>confirmar se segue como pastora presidente, foto e biografia atual</Lacuna>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-amber-300 bg-amber-50/60 p-5">
          <p className="text-sm leading-relaxed text-night-800/70">
            Esta página deve reunir nome, foto e uma breve biografia do
            pastor(a) presidente atual e dos demais pastores da Nova Terra.
          </p>
          <Lacuna>nomes, fotos e bios da liderança pastoral atual</Lacuna>
        </div>

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
