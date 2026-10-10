import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CTAButton from "@/components/CTAButton";
import { getNoticias } from "@/lib/noticias";
import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Notícias",
  description:
    "Recapes de eventos, testemunhos de membros e histórias de impacto do Casa Amarela: notícias da Igreja Nova Terra, em Icoaraci.",
  path: "/blog",
});

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  // Falha na consulta é tratada como lista vazia (estado vazio acolhedor).
  const noticias = await getNoticias().catch(() => []);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Início", path: "/" },
          { name: "Notícias", path: "/blog" },
        ])}
      />
      <PageHero
        eyebrow="Notícias"
        title={"O que Deus tem feito\nna Nova Terra"}
        description="Recapes de eventos, testemunhos reais de membros e histórias de impacto do Casa Amarela."
      />

      {noticias.length === 0 ? (
        <section className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <div className="rounded-2xl glass p-8 sm:p-10">
            <p className="font-serif text-lg font-medium text-night-900">
              Em breve novas notícias.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-night-800/75">
              Recapes de eventos, testemunhos e conteúdo de ensino aparecerão
              aqui assim que forem publicados.
            </p>
            <div className="mt-6 flex justify-center">
              <CTAButton href="/fale-conosco" variant="secondary">
                Fale Conosco
              </CTAButton>
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {noticias.map((n) => (
              <Link
                key={n.slug}
                href={`/blog/${n.slug}`}
                className="flex flex-col overflow-hidden rounded-2xl glass transition hover:shadow-card-hover motion-safe:hover:-translate-y-0.5"
              >
                <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-terra-100 via-terra-50 to-white">
                  {n.imagemUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={n.imagemUrl}
                      alt={n.titulo}
                      width={400}
                      height={160}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-terra-400" aria-hidden="true">
                      ✦
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-terra-800">
                    {formatarData(n.publicadoEm)}
                  </p>
                  <h3 className="mt-1 font-serif text-lg font-medium text-night-900">
                    {n.titulo}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-night-800/70">
                    {n.resumo}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
