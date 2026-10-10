import Image from "next/image";
import FooterLink from "./FooterLink";
import { donateItem, mainNav, site, socialLinks, whatsappLink } from "@/lib/site";

type FooterLink = { href: string; label: string };

const byHref = (href: string) => mainNav.find((i) => i.href === href)!;
const quemSomos = byHref("/quem-somos");
const redes = byHref("/redes");

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Quem somos",
    links: [
      { href: quemSomos.href, label: "Visão geral" },
      ...(quemSomos.children ?? []),
    ],
  },
  {
    title: "Participe",
    links: [
      { href: redes.href, label: redes.label },
      { href: "/jornada-de-discipulado", label: "Jornada de Discipulado" },
      byHref("/casa-amarela"),
      byHref("/eventos"),
      byHref("/empreendedores"),
      donateItem,
    ],
  },
  {
    title: "Informação",
    links: [
      byHref("/blog"),
      byHref("/fale-conosco"),
      { href: "/fale-conosco?assunto=oracao#formulario", label: "Pedido de oração" },
      { href: "/politica-de-privacidade", label: "Política de Privacidade" },
    ],
  },
];

const linkClass =
  "inline-block py-1 text-sm text-night-800 underline-offset-4 transition hover:text-night-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-900";

const headingClass =
  "text-xs font-semibold uppercase tracking-wider text-night-900";

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden text-night-900">
      <div className="mx-auto max-w-6xl px-4 pb-6 pt-12 sm:px-6">
        <div className="grid gap-x-10 gap-y-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
          {/* Marca: logo, o que somos, onde estamos */}
          <div>
            <Image
              src="/logo-igreja-nova-terra.webp"
              alt="Igreja Nova Terra — ícone de leão e chama com o nome da igreja"
              width={974}
              height={482}
              sizes="140px"
              // Logo é de uma cor só (laranja): sobre o fundo laranja viraria
              // silhueta escura (night), como o logo preto da referência.
              className="h-9 w-auto brightness-0"
            />
            <p className="mt-4 max-w-xs text-base font-medium leading-snug text-night-900">
              Existimos para ganhar, cuidar e capacitar vidas para o Reino de
              Deus, em Icoaraci, Belém-PA.
            </p>
            <p className="mt-1.5 max-w-xs text-sm leading-snug text-night-800">
              {site.closing}
            </p>
            <address className="mt-4 max-w-xs text-xs not-italic leading-snug text-night-800">
              {site.address}
            </address>
          </div>

          {/* Navegação (3 colunas) + contato */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
            {columns.map((col) => (
              <nav key={col.title} aria-label={`Rodapé: ${col.title}`}>
                <h2 className={headingClass}>{col.title}</h2>
                <ul className="mt-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <FooterLink href={l.href} className={linkClass}>
                        {l.label}
                      </FooterLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div className="col-span-2 md:col-span-1">
              <h2 className={headingClass}>Contato</h2>
              <dl className="mt-2 space-y-2.5 text-sm">
                <div>
                  <dt className="text-xs text-night-800">WhatsApp</dt>
                  <dd>
                    <a
                      href={whatsappLink("Olá! Gostaria de mais informações.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      {site.whatsappDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-night-800">E-mail</dt>
                  <dd>
                    <a href={`mailto:${site.email}`} className={`${linkClass} break-all`}>
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-night-800">Redes sociais</dt>
                  <dd className="flex flex-wrap gap-x-4">
                    {socialLinks.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        {s.label}
                      </a>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <p className="mt-10 text-xs text-night-800">
          © {new Date().getFullYear()} Igreja Pentecostal Missionária Nova
          Terra. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
