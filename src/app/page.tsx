import Link from "next/link";
import type { Metadata } from "next";
import CTAButton from "@/components/CTAButton";
import HeroSlider, { type HeroSlide } from "@/components/HeroSlider";
import Reveal from "@/components/Reveal";
import { whatsappLink } from "@/lib/site";
import { JsonLd, churchLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: { absolute: "Igreja Nova Terra | Icoaraci, Belém-PA" },
  description:
    "A Igreja Nova Terra existe para ganhar, cuidar e capacitar vidas para o Reino de Deus, em Icoaraci, Belém-PA. Conheça as Redes e venha nos visitar.",
  path: "/",
});

const heroSlides: HeroSlide[] = [
  {
    id: "avivamento",
    eyebrow: "Icoaraci, Belém-PA",
    title: "Nós somos o Avivamento. E ele também pode ter o seu nome.",
    subtitle:
      "A Igreja Nova Terra existe para ganhar, cuidar e capacitar vidas para o Reino de Deus. Se você está buscando um lugar para recomeçar, crescer na fé ou servir, este é o seu convite.",
    buttons: [
      { label: "Quero visitar um culto", href: "/jornada-de-discipulado" },
      {
        label: "Quero pedir oração",
        href: whatsappLink("Olá! Gostaria de pedir oração."),
        variant: "secondary",
        external: true,
      },
    ],
    image: {
      desktop: "/hero/bandeira-desktop.webp",
      mobile: "/hero/bandeira-mobile.webp",
      alt: "Altar da Igreja Nova Terra decorado com flores e a bandeira de Israel",
    },
  },
  {
    id: "culto",
    title: "Aqui, cada domingo é um novo começo",
    subtitle: "Vidas sendo transformadas, toda semana",
    buttons: [
      { label: "Ver horários dos cultos", href: "/jornada-de-discipulado" },
    ],
    image: {
      desktop: "/hero/culto-desktop.webp",
      mobile: "/hero/culto-mobile.webp",
      alt: "Culto da Igreja Nova Terra com banda no palco e congregação reunida",
    },
  },
  {
    id: "avivamento-multiplicacao",
    title: "Avivamento sem multiplicação morre",
    subtitle: "Não basta sentir o fogo — o chamado é repassar a chama, geração após geração",
    buttons: [
      { label: "Nossa missão e visão", href: "/quem-somos/missao-e-visao" },
    ],
    image: {
      desktop: "/hero/trigo-desktop.webp",
      mobile: "/hero/trigo-mobile.webp",
      alt: "Trigo em destaque durante momento de adoração na Igreja Nova Terra",
    },
  },
  {
    id: "oracao",
    title: "Um lugar seguro para orar e recomeçar",
    subtitle: "Nenhuma dor é grande demais para ser levada até Deus — e ninguém aqui ora sozinho",
    buttons: [
      {
        label: "Quero pedir oração",
        href: whatsappLink("Olá! Gostaria de pedir oração."),
        variant: "secondary",
        external: true,
      },
    ],
    image: {
      desktop: "/hero/oracao-desktop.webp",
      mobile: "/hero/oracao-mobile.webp",
      alt: "Mulher em momento de oração",
    },
  },
];

const destaques = [
  {
    title: "Cultos da Família",
    detail: "Domingos às 08h30 e 18h30",
    cta: "Ver localização",
    href: "/fale-conosco",
  },
  {
    title: "JAVAN, a Rede Jovem",
    detail: "Sábados, 19h",
    cta: "Saiba mais",
    href: "/redes/javan",
  },
  {
    title: "Casa Amarela",
    detail: "Apoio a mulheres em vulnerabilidade em Icoaraci",
    cta: "Conheça o projeto",
    href: "/casa-amarela",
  },
  {
    title: "Encontre sua Rede",
    detail: "17 frentes de serviço e comunhão",
    cta: "Ver todas as Redes",
    href: "/redes",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={churchLd()} />
      <HeroSlider slides={heroSlides} />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destaques.map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <Link
                href={item.href}
                className="group flex h-full flex-col justify-between rounded-2xl border border-terra-100 bg-gradient-to-br from-terra-100 via-terra-50 to-white p-6 shadow-card transition hover:shadow-card-hover motion-safe:hover:-translate-y-0.5"
              >
                <div>
                  <h3 className="font-serif text-lg font-semibold text-night-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-night-800/70">{item.detail}</p>
                </div>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-terra-800 group-hover:gap-2 transition-all">
                  {item.cta} →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-terra-50/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-2 md:items-center">
          <Reveal>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-terra-800">
                Nossa visão
              </p>
              <h2 className="mt-3 font-serif text-2xl font-bold text-night-900 sm:text-3xl">
                Tornar cada membro fruto permanente.
              </h2>
              <p className="mt-4 leading-relaxed text-night-800/70">
                Nossa missão é ganhar, cuidar e capacitar. Cremos que
                avivamento sem multiplicação morre — por isso caminhamos
                juntos, geração após geração, formando discípulos que também
                fazem discípulos.
              </p>
              <div className="mt-6">
                <CTAButton href="/quem-somos/missao-e-visao" variant="secondary">
                  Conheça nossa fé e visão
                </CTAButton>
              </div>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["17", "Redes de serviço"],
              ["2007", "Ano de fundação"],
              ["6", "Passos na Jornada de Discipulado"],
              ["1", "Projeto social — Casa Amarela"],
            ].map(([n, label], i) => (
              <Reveal key={label} delay={120 + i * 90}>
                <div className="rounded-2xl border border-terra-100 bg-white p-6 text-center">
                  <p className="font-serif text-3xl font-bold text-terra-700">{n}</p>
                  <p className="mt-1 text-sm text-night-800/70">{label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20">
        <Reveal>
          <h2 className="font-serif text-2xl font-bold text-night-900 sm:text-3xl">
            Primeira vez por aqui?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-night-800/70">
            Ficamos felizes com sua visita. Dê o próximo passo agora mesmo —
            estamos prontos para caminhar com você.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CTAButton href="/jornada-de-discipulado">
              Quero começar minha jornada
            </CTAButton>
            <CTAButton
              href={whatsappLink("Olá! Gostaria de pedir oração.")}
              external
              variant="secondary"
            >
              Quero pedir oração
            </CTAButton>
            <CTAButton href="/casa-amarela" variant="secondary">
              Quero ajudar o Casa Amarela
            </CTAButton>
          </div>
        </Reveal>
      </section>
    </>
  );
}
