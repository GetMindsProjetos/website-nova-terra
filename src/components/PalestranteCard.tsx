import Reveal from "@/components/Reveal";

type Props = {
  nome: string;
  papel: string;
  bio: string;
  fotoUrl: string;
};

export default function PalestranteCard({ nome, papel, bio, fotoUrl }: Props) {
  return (
    <Reveal>
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-3xl glass p-6 text-center shadow-sm sm:flex-row sm:text-left">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fotoUrl}
          alt={nome}
          width={128}
          height={160}
          loading="lazy"
          decoding="async"
          className="h-40 w-32 shrink-0 rounded-2xl object-cover object-top shadow-md"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-terra-800">
            Palestrante
          </p>
          <p className="mt-1 font-serif text-xl font-bold text-night-900">{nome}</p>
          <p className="text-sm font-medium text-terra-800">{papel}</p>
          <p className="mt-2 text-sm leading-relaxed text-night-800/70">{bio}</p>
        </div>
      </div>
    </Reveal>
  );
}
