import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CTAButton from "@/components/CTAButton";
import { whatsappLink } from "@/lib/site";
import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Jornada de Discipulado",
  description:
    "Do acolhimento ao serviço numa Rede: conheça os 6 passos da Jornada de Discipulado da Igreja Nova Terra, em Icoaraci, Belém-PA.",
  path: "/jornada-de-discipulado",
});

const passos = [
  {
    n: "01",
    title: "Visite e seja acolhido",
    desc: "A Rede de Acolhimento existe para que ninguém se sinta sozinho na primeira vez.",
  },
  {
    n: "02",
    title: "Torne-se membro / Fruto Permanente",
    desc: "Cadastro, integração e batismo nas águas (realizado em cultos de acolhimento, em junho e dezembro).",
  },
  {
    n: "03",
    title: "Discipulado na Mesa",
    desc: "8 encontros em grupos pequenos, na casa de anfitriões, para trabalhar caráter e caminhar em comunhão real.",
    href: "/jornada-de-discipulado/discipulado-na-mesa",
  },
  {
    n: "04",
    title: "Imersão + Escola de Cura",
    desc: "Dois dias dedicados a conhecer a Palavra e olhar para dentro, com apoio para lidar com traumas e mágoas.",
  },
  {
    n: "05",
    title: "Escola de Paulo",
    desc: "Formação bíblica estruturada (módulos de discípulo e líder, 2 anos), preparando cada pessoa para servir com profundidade.",
  },
  {
    n: "06",
    title: "Sirva numa Rede",
    desc: "O passo final é o começo de tudo: usar dons e talentos numa das 17 Redes da igreja.",
  },
];

export default function JornadaPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Início", path: "/" },
          { name: "Jornada de Discipulado", path: "/jornada-de-discipulado" },
        ])}
      />
      <PageHero
        eyebrow="Jornada de Discipulado"
        title={"Seu próximo passo\nna Nova Terra"}
        description="Toda pessoa que chega à Nova Terra é convidada a percorrer o mesmo caminho — o caminho que transformou quem já está aqui."
      >
        <CTAButton href={whatsappLink("Olá! Quero começar minha jornada de discipulado na Nova Terra.")} external>
          Quero começar minha jornada
        </CTAButton>
      </PageHero>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <ol className="space-y-6">
          {passos.map((p) => (
            <li key={p.n} className="flex gap-5 rounded-2xl glass p-6 shadow-sm">
              <span className="font-serif text-2xl font-bold text-terra-300">{p.n}</span>
              <div>
                <h2 className="font-serif text-lg font-semibold text-night-900">
                  {p.href ? (
                    <Link href={p.href} className="hover:text-terra-800">
                      {p.title}
                    </Link>
                  ) : (
                    p.title
                  )}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-night-800/70">{p.desc}</p>
                {p.href && (
                  <Link
                    href={p.href}
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-terra-800 transition-all hover:gap-1.5"
                  >
                    Saiba mais <span aria-hidden>→</span>
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <CTAButton href={whatsappLink("Olá! Quero começar minha jornada de discipulado na Nova Terra.")} external>
            Quero começar minha jornada
          </CTAButton>
        </div>
      </section>
    </>
  );
}
