import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import EmpresaCard from "@/components/EmpresaCard";
import Reveal from "@/components/Reveal";
import { getEmpresas } from "@/lib/empresas";
import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Empreendedores",
  description:
    "Conheça e apoie os negócios de membros e empreendedores da Igreja Nova Terra. Fortalecer uns aos outros também é uma forma de servir.",
  path: "/empreendedores",
});

export default async function EmpreendedoresPage() {
  const empresas = await getEmpresas();

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Início", path: "/" },
          { name: "Empreendedores", path: "/empreendedores" },
        ])}
      />
      <PageHero
        eyebrow="Rede do Empreendedor"
        title="Empreendedores da Nova Terra"
        description="Conheça os negócios de membros e empreendedores da nossa igreja. Fortalecer uns aos outros também é uma forma de servir."
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        {empresas.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {empresas.map((empresa, i) => (
              <Reveal key={empresa.slug} delay={(i % 6) * 70}>
                <EmpresaCard empresa={empresa} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-terra-200 bg-terra-50/60 p-8 text-center">
            <p className="text-sm leading-relaxed text-night-800/75">
              Em breve, os primeiros empreendedores cadastrados aparecerão
              aqui.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
