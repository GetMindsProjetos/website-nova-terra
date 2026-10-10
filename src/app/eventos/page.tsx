import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import EventCard from "@/components/EventCard";
import Reveal from "@/components/Reveal";
import CTAButton from "@/components/CTAButton";
import { site } from "@/lib/site";
import { getEventos } from "@/lib/eventos";
import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Eventos e Agenda",
  description:
    "Agenda de eventos da Igreja Nova Terra: calendário das Redes e da igreja, com informações e inscrições, em Icoaraci, Belém-PA.",
  path: "/eventos",
});

export default async function EventosPage() {
  // Falha na consulta é tratada como lista vazia (estado vazio acolhedor).
  const eventos = await getEventos().catch(() => []);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Início", path: "/" },
          { name: "Eventos", path: "/eventos" },
        ])}
      />
      <PageHero
        eyebrow="Eventos e Agenda"
        title="O que está acontecendo na Nova Terra"
        description="Calendário de eventos das nossas Redes e da igreja como um todo. Agenda em atualização contínua pela Rede de Mídia."
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        {eventos.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-terra-200 bg-terra-50/60 p-8 text-center sm:p-10">
            <p className="font-serif text-lg font-semibold text-night-900">
              Em breve novos eventos.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-night-800/75">
              Acompanhe pelo Instagram para saber das próximas datas.
            </p>
            <div className="mt-6 flex justify-center">
              <CTAButton href={site.social.instagram} external>
                Acompanhar no Instagram
              </CTAButton>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {eventos.map((evento, i) => (
              <Reveal key={evento.slug} delay={(i % 6) * 70}>
                <EventCard evento={evento} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
