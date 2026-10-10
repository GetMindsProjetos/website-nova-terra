import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CTAButton from "@/components/CTAButton";
import Lacuna from "@/components/Lacuna";
import { whatsappLink } from "@/lib/site";
import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Discipulado na Mesa",
  description:
    "O que é o Discipulado na Mesa e como participar: 8 encontros em grupos pequenos, na casa de anfitriões, para trabalhar caráter e caminhar em comunhão real.",
  path: "/jornada-de-discipulado/discipulado-na-mesa",
});

const encontros = [
  {
    n: "1–2",
    title: "Chegada e confiança",
    desc: "Os primeiros encontros abrem espaço para o grupo se conhecer de verdade e construir confiança — a base de qualquer comunhão real.",
  },
  {
    n: "3–5",
    title: "Caráter em construção",
    desc: "O meio da jornada mergulha em temas de caráter, hábitos e áreas de luta, sempre à luz da Palavra e da vida em comunidade.",
  },
  {
    n: "6–8",
    title: "Comunhão e próximo passo",
    desc: "Os últimos encontros consolidam vínculos duradouros e preparam cada participante para o próximo passo da Jornada de Discipulado.",
  },
];

export default function DiscipuladoNaMesaPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Início", path: "/" },
          { name: "Jornada de Discipulado", path: "/jornada-de-discipulado" },
          {
            name: "Discipulado na Mesa",
            path: "/jornada-de-discipulado/discipulado-na-mesa",
          },
        ])}
      />
      <PageHero
        eyebrow="Jornada de Discipulado"
        title="Discipulado na Mesa"
        description="Um grupo pequeno, uma mesa, oito encontros — e uma comunhão que fica. É o terceiro passo da Jornada de Discipulado da Nova Terra."
      >
        <CTAButton
          href={whatsappLink("Olá! Quero participar do Discipulado na Mesa.")}
          external
        >
          Quero participar
        </CTAButton>
      </PageHero>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <h2 className="font-serif text-2xl font-bold text-night-900">
          O que é
        </h2>
        <p className="mt-4 text-base leading-relaxed text-night-800/70">
          O Discipulado na Mesa é um ciclo de 8 encontros em grupos pequenos,
          reunidos na casa de anfitriões da igreja — não num salão, mas ao
          redor de uma mesa, como uma família se reuniria para uma refeição.
          É o espaço onde o crescimento espiritual deixa de ser só ouvir uma
          mensagem e passa a ser viver em comunhão real: perguntas honestas,
          caráter trabalhado e vidas caminhando juntas.
        </p>
        <p className="mt-4 text-base leading-relaxed text-night-800/70">
          Faz parte do terceiro passo da{" "}
          <Link href="/jornada-de-discipulado" className="font-medium text-terra-800 hover:underline">
            Jornada de Discipulado
          </Link>
          , depois do acolhimento e da integração como membro, e antes da
          Imersão, da Escola de Cura e da Escola de Paulo.
        </p>

        <h2 className="mt-12 font-serif text-2xl font-bold text-night-900">
          Como funciona
        </h2>
        <ol className="mt-6 space-y-5">
          {encontros.map((e) => (
            <li
              key={e.n}
              className="flex gap-5 rounded-2xl glass p-6 shadow-sm"
            >
              <span className="shrink-0 font-serif text-sm font-bold text-terra-800">
                Encontros {e.n}
              </span>
              <div>
                <h3 className="font-serif text-lg font-semibold text-night-900">
                  {e.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-night-800/70">
                  {e.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-4">
          <Lacuna>
            calendário oficial de turmas, duração de cada encontro e material de
            apoio usado
          </Lacuna>
        </div>

        <h2 className="mt-12 font-serif text-2xl font-bold text-night-900">
          Como participar
        </h2>
        <p className="mt-4 text-base leading-relaxed text-night-800/70">
          Basta chamar a igreja no WhatsApp e dizer que quer entrar num
          grupo de Discipulado na Mesa. A Rede de Acolhimento te ajuda a
          encontrar uma turma com vaga, próxima da sua região ou disponível
          no seu horário.
        </p>

        <h2 className="mt-12 font-serif text-2xl font-bold text-night-900">
          Quer ser anfitrião?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-night-800/70">
          Abrir sua casa para um grupo é um dos jeitos mais diretos de
          servir na Nova Terra. Anfitriões recebem apoio e acompanhamento da
          liderança durante todo o ciclo de encontros.
        </p>
        <div className="mt-2">
          <Lacuna>requisitos e processo formal para se tornar anfitrião</Lacuna>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <CTAButton
            href={whatsappLink("Olá! Quero participar do Discipulado na Mesa.")}
            external
          >
            Quero participar
          </CTAButton>
          <CTAButton href="/jornada-de-discipulado" variant="secondary">
            Ver a Jornada completa
          </CTAButton>
        </div>
      </section>
    </>
  );
}
