import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import InscricaoHero from "@/components/InscricaoHero";
import PalestranteCard from "@/components/PalestranteCard";
import InscricaoForm from "@/components/InscricaoForm";
import { getEventoBySlug, formatPreco, formatDataEvento } from "@/lib/eventos";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

// Assets premium preparados especificamente para o Encontro de Empreendedores
// (anuncio do Facebook ja aponta para esta URL, entao o layout muda aqui
// sem alterar o link).
const HERO_PREMIUM_SLUG = "encontro-de-empreendedores";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const evento = await getEventoBySlug(slug);
  if (!evento) return { robots: { index: false, follow: false } };
  return pageMetadata({
    title: `Inscrição: ${evento.titulo}`,
    description: `Inscreva-se no evento ${evento.titulo}, da Igreja Nova Terra. ${evento.descricao}`,
    path: `/eventos/${evento.slug}/inscricao`,
    image: evento.imagemUrl
      ? { url: evento.imagemUrl, alt: evento.titulo }
      : undefined,
    noindex: true,
  });
}

export default async function InscricaoPage({ params }: Props) {
  const { slug } = await params;
  const evento = await getEventoBySlug(slug);
  if (!evento || !evento.inscricoesAbertas) notFound();

  const descricaoCompleta = evento.gratuito
    ? evento.descricao
    : `${evento.descricao} — Valor: ${formatPreco(evento.preco ?? 0)}`;

  const isPremium = evento.slug === HERO_PREMIUM_SLUG;

  return (
    <>
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
        <PageHero eyebrow="Inscrição" title={evento.titulo} description={descricaoCompleta} />
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

      <section className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        {!isPremium && evento.imagemUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={evento.imagemUrl}
            alt={evento.titulo}
            width={576}
            height={432}
            loading="lazy"
            decoding="async"
            className="mb-8 aspect-[4/3] w-full rounded-2xl object-cover"
          />
        )}
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
            <h2 className="font-serif text-2xl font-bold text-night-900">
              Garanta sua vaga agora.
            </h2>
          </div>
        ) : (
          <h2 className="mb-6 font-serif text-2xl font-bold text-night-900">
            Faça sua Inscrição.
          </h2>
        )}
        <InscricaoForm evento={evento} />
      </section>
    </>
  );
}
