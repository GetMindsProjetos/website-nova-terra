import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CTAButton from "@/components/CTAButton";
import ShareButton from "@/components/ShareButton";
import { formatDataEvento, formatPreco, getEventoBySlug, isEventoEncerrado } from "@/lib/eventos";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const evento = await getEventoBySlug(slug);
  if (!evento) return {};

  return {
    title: evento.titulo,
    description: evento.descricao,
    openGraph: {
      type: "website",
      title: evento.titulo,
      description: evento.descricao,
      images: evento.imagemUrl
        ? [
            {
              url: evento.imagemUrl,
              width: 1200,
              height: 900,
              alt: evento.titulo,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: evento.titulo,
      description: evento.descricao,
      images: evento.imagemUrl ? [evento.imagemUrl] : undefined,
    },
  };
}

export default async function EventoDetalhePage({ params }: Props) {
  const { slug } = await params;
  const evento = await getEventoBySlug(slug);
  if (!evento) notFound();

  return (
    <>
      <PageHero
        eyebrow={evento.detalhe ?? "Evento"}
        title={evento.titulo}
        description={evento.descricao}
      />
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        {evento.imagemUrl && (
          <div className="relative mb-8 aspect-[4/3] w-full overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={evento.imagemUrl}
              alt={evento.titulo}
              className="h-full w-full object-cover"
            />
            {evento.palestrante && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-5 pb-4 pt-16">
                <p className="font-serif text-2xl font-bold uppercase italic text-white">
                  {evento.palestrante}
                </p>
              </div>
            )}
          </div>
        )}

        {(evento.dataEvento || evento.horaEvento) && (
          <div className="flex flex-wrap items-center gap-4 text-sm text-night-800/70">
            {evento.dataEvento && (
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-terra-600 stroke-2">
                  <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
                  <path d="M8 3v4M16 3v4M3.5 10h17" strokeLinecap="round" />
                </svg>
                {formatDataEvento(evento.dataEvento)}
              </span>
            )}
            {evento.horaEvento && (
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-terra-600 stroke-2">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {evento.horaEvento}
              </span>
            )}
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              evento.gratuito
                ? "bg-terra-50 text-terra-700"
                : "bg-night-900/5 text-night-900"
            }`}
          >
            {evento.gratuito ? "Gratuito" : formatPreco(evento.preco ?? 0)}
          </span>
          <ShareButton
            title={evento.titulo}
            text={`Confira: ${evento.titulo} — Igreja Nova Terra`}
            path={`/eventos/${evento.slug}`}
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {evento.inscricoesAbertas ? (
            <CTAButton href={`/eventos/${evento.slug}/inscricao`}>
              Inscreva-se
            </CTAButton>
          ) : (
            <span className="inline-flex items-center justify-center rounded-full border border-terra-100 px-5 py-2.5 text-sm font-medium text-night-800/50">
              {isEventoEncerrado(evento) ? "Inscrições encerradas" : "Sem inscrição necessária"}
            </span>
          )}
          <Link
            href="/eventos"
            className="inline-flex items-center justify-center rounded-full border border-terra-200 px-5 py-2.5 text-sm font-semibold text-night-800 transition hover:bg-terra-50"
          >
            Ver todos os eventos
          </Link>
        </div>

        {evento.patrocinadores.length > 0 && (
          <div className="mt-12 border-t border-terra-100 pt-8">
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-night-800/50">
              Patrocinadores
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
              {evento.patrocinadores.map((p) => (
                <div key={p.nome} className="flex flex-col items-center gap-2">
                  {p.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.logoUrl}
                      alt={p.nome}
                      className="h-14 w-14 rounded-lg border border-terra-100 object-contain p-1"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-terra-100 text-xs font-semibold text-terra-600">
                      {p.nome.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs text-night-800/60">{p.nome}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
