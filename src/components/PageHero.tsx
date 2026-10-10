import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export default function PageHero({ eyebrow, title, description, children }: Props) {
  // Quebra do título: "\n" explícito, ou depois de um travessão ("A — B"),
  // e cada linha é balanceada. Títulos curtos ficam numa linha só.
  const linhas = title.includes("\n")
    ? title.split("\n")
    : title.replace(/ — /g, " —\n").split("\n");

  // A seção sobe por baixo do menu (transparente no topo): o fundo fixo passa
  // pelos dois, sem emenda. O padding-top compensa a altura do menu.
  return (
    <section
      data-header-overlap
      className="relative isolate -mt-[var(--header-h)] overflow-hidden"
    >
      <div className="mx-auto max-w-4xl px-4 pb-14 pt-[calc(3.5rem+var(--header-h))] text-center sm:px-6 sm:pb-20 sm:pt-[calc(5rem+var(--header-h))]">
        {eyebrow && (
          <Reveal>
            <p className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-wide text-night-900">
              <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-terra-600" />
              {eyebrow}
              <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-terra-600" />
            </p>
          </Reveal>
        )}
        <Reveal delay={80}>
          <h1 className="mt-4 text-balance font-serif text-3xl font-medium tracking-[-0.035em] text-night-900 sm:text-4xl lg:text-5xl">
            {linhas.map((linha, i) => (
              <span key={i} className="block text-balance">
                {i > 0 ? " " : null}
                {linha}
              </span>
            ))}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={160}>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-night-900 sm:text-lg">
              {description}
            </p>
          </Reveal>
        )}
        {children && (
          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {children}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
