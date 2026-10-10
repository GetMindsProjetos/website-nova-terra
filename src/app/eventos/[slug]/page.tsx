import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import InscricaoHero from "@/components/InscricaoHero";
import PalestranteCard from "@/components/PalestranteCard";
import InscricaoForm from "@/components/InscricaoForm";
import ShareButton from "@/components/ShareButton";
import { formatDataEvento, formatPreco, getEventoBySlug, isEventoEncerrado } from "@/lib/eventos";
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

// Assets premium preparados especificamente para o Encontro de Empreendedores
// (o anúncio do Facebook aponta para /eventos/<slug>/inscricao, que agora
// redireciona para cá; o layout muda aqui sem alterar o link).
const HERO_PREMIUM_SLUG = "encontro-de-empreendedores";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const evento = await getEventoBySlug(slug);
  if (!evento) {
    return pageMetadata({
      title: "Evento",
      description:
        "Agenda de eventos da Igreja Nova Terra: calendário das Redes e da igreja, com informações e inscrições, em Icoaraci, Belém-PA.",
      path: `/eventos/${slug}`,
      noindex: true,
    });
  }

  const descricao = evento.dataEvento
    ? `${evento.descricao} Data: ${formatDataEvento(evento.dataEvento)}.`
    : evento.descricao;

  return pageMetadata({
    title: evento.titulo,
    description: descricao,
    path: `/eventos/${evento.slug}`,
    image: evento.imagemUrl
      ? { url: evento.imagemUrl, width: 1200, height: 900, alt: evento.titulo }
      : undefined,
  });
}

export default async function EventoDetalhePage({ params }: Props) {
  const { slug } = await params;
  const evento = await getEventoBySlug(slug);
  if (!evento) notFound();

  // Event só com campos reais (sem local no esquema: location fica de fora).
  // A página não indica cancelamento; encerrado/aberto mantém EventScheduled.
  const eventoLd = evento.dataEvento
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: evento.titulo,
        description: evento.descricao,
        startDate: evento.dataEvento,
        eventStatus: "https://schema.org/EventScheduled",
        url: absoluteUrl(`/eventos/${evento.slug}`),
        ...(evento.imagemUrl ? { image: [absoluteUrl(evento.imagemUrl)] } : {}),
        ...(evento.palestrante
          ? { performer: { "@type": "Person", name: evento.palestrante } }
          : {}),
        organizer: {
          "@type": "Church",
          name: site.fullName,
          url: siteUrl,
        },
        ...(evento.inscricoesAbertas &&
        (evento.gratuito || evento.preco !== null)
          ? {
              offers: {
                "@type": "Offer",
                url: absoluteUrl(`/eventos/${evento.slug}`),
                price: evento.gratuito ? 0 : evento.preco,
                priceCurrency: "BRL",
                availability: "https://schema.org/InStock",
              },
            }
          : {}),
      }
    : null;

  const isPremium =
    evento.slug === HERO_PREMIUM_SLUG && evento.inscricoesAbertas;
  const descricaoCompleta = evento.gratuito
    ? evento.descricao
    : `${evento.descricao} — Valor: ${formatPreco(evento.preco ?? 0)}`;

  return (
    <>
      {eventoLd && <JsonLd data={eventoLd} />}
      <JsonLd
        data={breadcrumbLd([
          { name: "Início", path: "/" },
          { name: "Eventos", path: "/eventos" },
          { name: evento.titulo, path: `/eventos/${evento.slug}` },
        ])}
      />
      {isPremium ? (
        <InscricaoHero
          eyebrow="Inscrição aberta"
          title={evento.titulo}
          description={descricaoCompleta}
          dataLabel={evento.dataEvento ? formatDataEvento(evento.dataEvento) : null}
          horaLabel={evento.horaEvento}
          localLabel="Igreja Nova Terra"
          bgDesktop="/eventos/empreendedores/hero-desktop.webp"
          bgMobile="/eventos/empreendedores/hero-mobile.webp"
        />
      ) : (
        // Sem descrição no hero: ela fica nos detalhes, para o conteúdo e o
        // formulário subirem na tela (principalmente no mobile).
        <PageHero eyebrow={evento.detalhe ?? "Evento"} title={evento.titulo} />
      )}

      {isPremium && evento.palestrante && (
        <section className="px-4 pt-12 sm:px-6">
          <PalestranteCard
            nome={evento.palestrante}
            papel="CEO e Fundador da Comercial do Norte"
            bio={evento.descricao}
            fotoUrl="/eventos/empreendedores/palestrante.webp"
          />
        </section>
      )}

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
          {/* Detalhes */}
          <div>
            {evento.imagemUrl && (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={evento.imagemUrl}
                  alt={evento.titulo}
                  width={672}
                  height={504}
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                {evento.palestrante && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-5 pb-4 pt-16">
                    <p className="font-serif text-2xl font-medium uppercase italic text-white">
                      {evento.palestrante}
                    </p>
                  </div>
                )}
              </div>
            )}

            {(evento.dataEvento || evento.horaEvento) && (
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-night-800/70">
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
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  evento.gratuito
                    ? "bg-terra-50 text-terra-800"
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

            {!isPremium && (
              <p className="mt-4 text-base leading-relaxed text-night-800/75">
                {descricaoCompleta}
              </p>
            )}

            <div className="mt-6">
              <Link
                href="/eventos"
                className="inline-flex min-h-[44px] items-center justify-center btn-glass rounded-full px-5 py-2.5 text-sm font-medium text-night-800"
              >
                Ver todos os eventos
              </Link>
            </div>
          </div>

          {/* Inscrição: já visível na própria página do evento */}
          <div
            id="inscricao"
            className="scroll-mt-24 rounded-2xl glass p-5 shadow-card sm:p-6"
          >
            {evento.inscricoesAbertas ? (
              <>
                {isPremium ? (
                  <div className="mb-6 flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/eventos/empreendedores/cta.webp"
                      alt=""
                      aria-hidden="true"
                      width={64}
                      height={64}
                      loading="lazy"
                      decoding="async"
                      className="h-16 w-16 shrink-0 rounded-full object-cover shadow-md"
                    />
                    <h2 className="font-serif text-2xl font-medium text-night-900">
                      Garanta sua vaga agora.
                    </h2>
                  </div>
                ) : (
                  <h2 className="mb-6 font-serif text-2xl font-medium text-night-900">
                    Faça sua Inscrição.
                  </h2>
                )}
                <InscricaoForm evento={evento} />
              </>
            ) : (
              <p className="text-center text-sm font-medium text-night-800/75">
                {isEventoEncerrado(evento)
                  ? "Inscrições encerradas."
                  : "Este evento não precisa de inscrição."}
              </p>
            )}
          </div>
        </div>

        {evento.patrocinadores.length > 0 && (
          <div className="mt-12 pt-4">
            <p className="text-center text-xs font-medium uppercase tracking-wide text-night-800/75">
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
                      width={56}
                      height={56}
                      loading="lazy"
                      decoding="async"
                      className="h-14 w-14 rounded-lg border border-terra-100 object-contain p-1"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-terra-100 text-xs font-medium text-terra-800">
                      {p.nome.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs text-night-800/75">{p.nome}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
