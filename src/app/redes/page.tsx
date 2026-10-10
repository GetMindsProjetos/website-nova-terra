import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { redes } from "@/lib/redes";
import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Redes",
  description:
    "Conheça as 17 Redes de serviço, cuidado e crescimento da Igreja Nova Terra e encontre a frente em que você pode servir e crescer.",
  path: "/redes",
});

export default function RedesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Início", path: "/" },
          { name: "Redes", path: "/redes" },
        ])}
      />
      <PageHero
        eyebrow="Redes"
        title="Encontre sua Rede"
        description="Na Nova Terra, chamamos nossos ministérios de Redes. São 17 frentes de serviço, cuidado e crescimento — cada uma com um propósito específico, mas todas conectadas pelo mesmo alvo: ganhar, cuidar e capacitar vidas."
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {redes.map((rede, i) => (
            <Reveal key={rede.slug} delay={(i % 6) * 70}>
              <Link
                href={`/redes/${rede.slug}`}
                className="group flex h-full flex-col justify-between rounded-2xl glass p-6 shadow-card transition hover:shadow-card-hover motion-safe:hover:-translate-y-0.5"
              >
                <div>
                  <h2 className="font-serif text-lg font-medium text-night-900">
                    {rede.nome}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-night-800/70">
                    {rede.resumo}
                  </p>
                </div>
                <span className="mt-5 inline-flex text-sm font-medium text-terra-800">
                  Saiba mais →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
