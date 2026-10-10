import Link from "next/link";
import { formatDataEvento, formatPreco, isEventoEncerrado, type Evento } from "@/lib/eventos";
import ShareButton from "@/components/ShareButton";

const iconesPorCategoria: Record<Evento["categoria"], string> = {
  geral: "✦",
  empreendedores: "◆",
};

function CalendarioIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-terra-600 stroke-2">
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M8 3v4M16 3v4M3.5 10h17" strokeLinecap="round" />
    </svg>
  );
}

function RelogioIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-terra-600 stroke-2">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function EventCard({ evento }: { evento: Evento }) {
  const href = `/eventos/${evento.slug}`;

  return (
    // Card inteiro clicável: o link do título cobre o card (after:inset-0);
    // compartilhar e o botão ficam acima (z-10) para continuarem clicáveis.
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl glass transition focus-within:ring-2 focus-within:ring-terra-600 hover:shadow-card-hover motion-safe:hover:-translate-y-0.5">
      <div className="relative aspect-[3/2] overflow-hidden bg-gradient-to-br from-terra-100 via-terra-50 to-white">
        {evento.imagemUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={evento.imagemUrl}
            alt=""
            width={600}
            height={400}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-300 motion-safe:group-hover:scale-[1.03]"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-4xl text-terra-400" aria-hidden="true">
            {iconesPorCategoria[evento.categoria]}
          </span>
        )}
        {evento.categoria === "empreendedores" && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-terra-600 px-2.5 py-0.5 text-xs font-medium text-white">
            Empreendedores
          </span>
        )}
        {evento.palestrante && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-3 pb-2 pt-8">
            <p className="truncate font-serif text-base font-medium uppercase italic text-white">
              {evento.palestrante}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              evento.gratuito
                ? "bg-terra-50 text-terra-800"
                : "bg-night-900/5 text-night-900"
            }`}
          >
            {evento.gratuito ? "Gratuito" : formatPreco(evento.preco ?? 0)}
          </span>
          <span className="relative z-10">
            <ShareButton
              title={evento.titulo}
              text={`Confira: ${evento.titulo} — Igreja Nova Terra`}
              path={href}
            />
          </span>
        </div>

        <h3 className="mt-2 line-clamp-2 font-serif text-lg font-medium leading-snug text-night-900">
          <Link
            href={href}
            className="outline-none after:absolute after:inset-0 after:content-[''] group-hover:text-terra-800"
          >
            {evento.titulo}
          </Link>
        </h3>
        {evento.detalhe && (
          <p className="mt-0.5 truncate text-xs font-medium uppercase tracking-wide text-terra-800">
            {evento.detalhe}
          </p>
        )}

        {(evento.dataEvento || evento.horaEvento) && (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-night-800/70">
            {evento.dataEvento && (
              <span className="flex items-center gap-1.5">
                <CalendarioIcon />
                {formatDataEvento(evento.dataEvento)}
              </span>
            )}
            {evento.horaEvento && (
              <span className="flex items-center gap-1.5">
                <RelogioIcon />
                {evento.horaEvento}
              </span>
            )}
          </div>
        )}

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-night-800/70">
          {evento.descricao}
        </p>

        <div className="mt-3">
          {evento.inscricoesAbertas ? (
            <Link
              href={href}
              className="relative z-10 inline-flex min-h-[44px] w-full items-center justify-center btn-glass-accent rounded-full px-5 py-2 text-sm font-medium text-white"
            >
              Inscreva-se
            </Link>
          ) : (
            <span className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-night-900/5 px-5 py-2 text-sm font-medium text-night-800">
              {isEventoEncerrado(evento) ? "Inscrições encerradas" : "Sem inscrição necessária"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
