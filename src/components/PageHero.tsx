import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export default function PageHero({ eyebrow, title, description, children }: Props) {
  return (
    <section className="border-b border-terra-100 bg-gradient-to-br from-terra-100 via-terra-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20">
        {eyebrow && (
          <Reveal>
            <p className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-wide text-terra-800">
              <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-terra-600" />
              {eyebrow}
              <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-terra-600" />
            </p>
          </Reveal>
        )}
        <Reveal delay={80}>
          <h1 className="mt-4 text-balance font-serif text-3xl font-bold tracking-tight text-night-900 sm:text-4xl lg:text-5xl">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={160}>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-night-800/75 sm:text-lg">
              {description}
            </p>
          </Reveal>
        )}
        {children && (
          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
