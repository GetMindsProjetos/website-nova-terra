import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import CTAButton from "@/components/CTAButton";
import { redes, getRedeBySlug } from "@/lib/redes";
import { whatsappLink } from "@/lib/site";
import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return redes.map((r) => ({ slug: r.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const rede = getRedeBySlug(params.slug);
  if (!rede) return {};
  return pageMetadata({
    title: rede.nome,
    description: `${rede.nome}, uma das Redes da Igreja Nova Terra. ${rede.resumo} Para: ${rede.paraQuem}. Ritmo: ${rede.ritmo}.`,
    path: `/redes/${rede.slug}`,
  });
}

export default function RedePage({ params }: Props) {
  const rede = getRedeBySlug(params.slug);
  if (!rede) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Início", path: "/" },
          { name: "Redes", path: "/redes" },
          { name: rede.nome, path: `/redes/${rede.slug}` },
        ])}
      />
      <PageHero eyebrow="Redes" title={rede.nome} description={rede.resumo} />
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="leading-relaxed text-night-800/80">{rede.descricao}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl glass p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-terra-800">
              Para quem
            </p>
            <p className="mt-1 text-sm text-night-800/80">{rede.paraQuem}</p>
          </div>
          <div className="rounded-xl glass p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-terra-800">
              Ritmo de encontros
            </p>
            <p className="mt-1 text-sm text-night-800/80">{rede.ritmo}</p>
          </div>
        </div>

        {rede.lideranca && (
          <p className="mt-4 text-xs italic text-amber-700">
            Liderança: {rede.lideranca}
          </p>
        )}

        <div className="mt-10 text-center">
          <CTAButton
            href={whatsappLink(`Olá! Quero participar da Rede ${rede.nome}.`)}
            external
          >
            Quero participar da {rede.nome}
          </CTAButton>
        </div>
      </article>
    </>
  );
}
