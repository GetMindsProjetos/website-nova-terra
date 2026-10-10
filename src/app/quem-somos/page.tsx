import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Quem Somos",
  description:
    "Conheça a história, a fé, a missão e a liderança da Igreja Nova Terra, uma igreja em avivamento em Icoaraci, Belém-PA, desde 2007.",
  path: "/quem-somos",
});

const links = [
  {
    href: "/quem-somos/historia",
    title: "Nossa História",
    desc: "Como a Nova Terra nasceu em 2007 e onde estamos hoje.",
  },
  {
    href: "/quem-somos/fe",
    title: "Nossa Fé",
    desc: "O que cremos, em poucas palavras.",
  },
  {
    href: "/quem-somos/missao-e-visao",
    title: "Missão e Visão",
    desc: "Ganhar, cuidar e capacitar — tornar cada membro fruto permanente.",
  },
  {
    href: "/quem-somos/lideranca",
    title: "Liderança",
    desc: "Quem caminha à frente da Nova Terra.",
  },
];

export default function QuemSomosPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Início", path: "/" },
          { name: "Quem Somos", path: "/quem-somos" },
        ])}
      />
      <PageHero
        eyebrow="Quem Somos"
        title={"Uma igreja em avivamento\nem Icoaraci"}
        description="Desde 2007, propagando o Evangelho de Jesus Cristo e promovendo o crescimento espiritual de cada pessoa que passa por nossas portas."
      />
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group rounded-2xl glass p-6 shadow-card transition hover:shadow-card-hover motion-safe:hover:-translate-y-0.5"
            >
              <h2 className="font-serif text-xl font-medium text-night-900">
                {l.title}
              </h2>
              <p className="mt-2 text-sm text-night-800/70">{l.desc}</p>
              <span className="mt-4 inline-flex text-sm font-medium text-terra-800">
                Ler mais →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
