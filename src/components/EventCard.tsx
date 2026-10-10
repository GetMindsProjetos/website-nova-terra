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
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-terra-100 bg-terra-50/50 shadow-card transition hover:shadow-card-hover motion-safe:hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-terra-100 via-terra-50 to-white">
        {evento.imagemUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={evento.imagemUrl}
            alt={evento.titulo}
            width={800}
            height={600}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-4xl text-terra-400" aria-hidden="true">
            {iconesPorCategoria[evento.categoria]}
          </span>
        )}
        {evento.categoria === "empreendedores" && (
          <span className="absolute right-3 top-3 rounded-full bg-terra-600 px-3 py-1 text-xs font-semibold text-night-900">
            Empreendedores
          </span>
        )}
        {evento.palestrante && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 pb-3 pt-10">
            <p className="font-serif text-lg font-bold uppercase italic text-white sm:text-xl">
              {evento.palestrante}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              evento.gratuito
                ? "bg-terra-50 text-terra-800"
                : "bg-night-900/5 text-night-900"
            }`}
          >
            {evento.gratuito ? "Gratuito" : formatPreco(evento.preco ?? 0)}
          </span>
          <ShareButton
            title={evento.titulo}
            text={`Confira: ${evento.titulo} — Igreja Nova Terra`}
            path={`/eventos/${evento.slug}`}
          />
        </div>

        <h3 className="mt-3 font-serif text-xl font-bold leading-snug text-night-900 sm:text-2xl">
          <Link href={`/eventos/${evento.slug}`} className="hover:text-terra-800">
            {evento.titulo}
          </Link>
        </h3>
        {evento.detalhe && (
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-terra-800">
            {evento.detalhe}
          </p>
        )}

        {(evento.dataEvento || evento.horaEvento) && (
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-night-800/70">
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

        <p className="mt-3 flex-1 text-sm leading-relaxed text-night-800/70">
          {evento.descricao}
        </p>

        <div className="mt-5">
          {evento.inscricoesAbertas ? (
            <Link
              href={`/eventos/${evento.slug}/inscricao`}
              className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-night-900 transition hover:bg-terra-500 active:bg-terra-700"
            >
              Inscreva-se
            </Link>
          ) : (
            <span className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-terra-100 px-5 py-2.5 text-sm font-medium text-night-800/75">
              {isEventoEncerrado(evento) ? "Inscrições encerradas" : "Sem inscrição necessária"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
