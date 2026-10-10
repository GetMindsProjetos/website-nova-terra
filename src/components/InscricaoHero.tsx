import Reveal from "@/components/Reveal";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  dataLabel?: string | null;
  horaLabel?: string | null;
  localLabel?: string;
  bgDesktop: string;
  bgMobile: string;
};

function Badge({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
      {icon}
      {children}
    </div>
  );
}

export default function InscricaoHero({
  eyebrow,
  title,
  description,
  dataLabel,
  horaLabel,
  localLabel,
  bgDesktop,
  bgMobile,
}: Props) {
  return (
    <section className="relative overflow-hidden">
      <picture>
        <source media="(min-width: 768px)" srcSet={bgDesktop} />
        <img
          src={bgMobile}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-t from-night-900/90 via-night-900/40 to-transparent" />
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-terra-200">
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-4 font-serif text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/85">
            {description}
          </p>
        </Reveal>
        {(dataLabel || horaLabel || localLabel) && (
          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {dataLabel && (
                <Badge
                  icon={
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-terra-200" aria-hidden="true">
                      <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1Zm13 8H4v10h16V10Z" />
                    </svg>
                  }
                >
                  {dataLabel}
                </Badge>
              )}
              {horaLabel && (
                <Badge
                  icon={
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-terra-200" aria-hidden="true">
                      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 10.41 4.29 4.3-1.42 1.41L11 13V6h2Z" />
                    </svg>
                  }
                >
                  {horaLabel}
                </Badge>
              )}
              {localLabel && (
                <Badge
                  icon={
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-terra-200" aria-hidden="true">
                      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
                    </svg>
                  }
                >
                  {localLabel}
                </Badge>
              )}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
