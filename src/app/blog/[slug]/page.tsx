import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { getNoticiaBySlug } from "@/lib/noticias";
import {
  JsonLd,
  absoluteUrl,
  breadcrumbLd,
  pageMetadata,
  siteUrl,
} from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const noticia = await getNoticiaBySlug(slug);
  if (!noticia) return {};
  return pageMetadata({
    title: noticia.titulo,
    description: noticia.resumo,
    path: `/blog/${noticia.slug}`,
    type: "article",
    publishedTime: noticia.publicadoEm,
    image: noticia.imagemUrl
      ? { url: noticia.imagemUrl, alt: noticia.titulo }
      : undefined,
  });
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function NoticiaPage({ params }: Props) {
  const { slug } = await params;
  const noticia = await getNoticiaBySlug(slug);
  if (!noticia) notFound();

  const paragrafos = noticia.conteudo
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: noticia.titulo,
          description: noticia.resumo,
          datePublished: noticia.publicadoEm,
          mainEntityOfPage: absoluteUrl(`/blog/${noticia.slug}`),
          ...(noticia.imagemUrl ? { image: absoluteUrl(noticia.imagemUrl) } : {}),
          author: { "@type": "Organization", name: site.name, url: siteUrl },
          publisher: { "@type": "Organization", name: site.name, url: siteUrl },
        }}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Início", path: "/" },
          { name: "Notícias", path: "/blog" },
          { name: noticia.titulo, path: `/blog/${noticia.slug}` },
        ])}
      />
      <PageHero
        eyebrow={formatarData(noticia.publicadoEm)}
        title={noticia.titulo}
        description={noticia.resumo}
      />
      <article className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20">
        {noticia.imagemUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={noticia.imagemUrl}
            alt={noticia.titulo}
            width={672}
            height={378}
            fetchPriority="high"
            decoding="async"
            className="mb-8 aspect-[16/9] w-full rounded-2xl object-cover"
          />
        )}
        <div className="space-y-4 text-base leading-relaxed text-night-800">
          {paragrafos.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>
    </>
  );
}
