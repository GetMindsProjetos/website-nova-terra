import type { Empresa } from "@/lib/empresas";
import { CATEGORIAS_EMPRESA, empresaWhatsappLink } from "@/lib/categoriasEmpresa";

export default function EmpresaCard({ empresa }: { empresa: Empresa }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl glass transition hover:shadow-card-hover motion-safe:hover:-translate-y-0.5">
      <div className="relative h-24 bg-gradient-to-br from-terra-100 via-terra-50 to-white">
        {empresa.capaUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={empresa.capaUrl}
            alt=""
            width={640}
            height={96}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute -bottom-8 left-6 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white shadow-sm">
          {empresa.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={empresa.logoUrl}
              alt={empresa.nome}
              width={64}
              height={64}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-serif text-xl font-bold text-terra-800">
              {empresa.nome.charAt(0)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 pt-10">
        <span className="w-fit rounded-full bg-terra-50 px-3 py-1 text-xs font-semibold text-terra-800">
          {CATEGORIAS_EMPRESA[empresa.categoria] ?? empresa.categoria}
        </span>
        <h3 className="mt-3 font-serif text-lg font-semibold text-night-900">
          {empresa.nome}
        </h3>
        {empresa.nomeResponsavel && (
          <p className="mt-0.5 text-xs text-night-800/75">
            {empresa.nomeResponsavel}
          </p>
        )}
        <p className="mt-3 flex-1 text-sm leading-relaxed text-night-800/70">
          {empresa.descricao}
        </p>

        <div className="mt-5 flex items-center gap-3">
          <a
            href={empresaWhatsappLink(empresa.whatsapp, empresa.nome)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 btn-glass-accent rounded-full px-5 py-2.5 text-sm font-semibold text-white"
          >
            Falar no WhatsApp
          </a>
          {empresa.instagram && (
            <a
              href={empresa.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram de ${empresa.nome}`}
              className="flex h-11 w-11 shrink-0 items-center justify-center btn-glass rounded-full text-terra-800"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.5]">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
