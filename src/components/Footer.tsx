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
      { href: "/politica-de-privacidade", label: "Política de Privacidade" },
    ],
  },
];

const linkClass =
  "inline-block py-2.5 text-night-900 underline-offset-4 transition hover:text-terra-800 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra-800";

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-terra-100 bg-gradient-to-br from-terra-100 via-terra-50 to-white text-night-900">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.3fr]">
        <div className="md:col-span-2 lg:col-span-1">
          <Image
            src="/logo-igreja-nova-terra.webp"
            alt="Igreja Nova Terra — ícone de leão e chama com o nome da igreja"
            width={974}
            height={482}
            sizes="160px"
            className="h-10 w-auto"
          />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-night-800/80">
            Existimos para ganhar, cuidar e capacitar vidas para o Reino de
            Deus, em Icoaraci, Belém-PA. {site.closing}
          </p>
          <p className="mt-4 text-sm text-night-800/80">{site.address}</p>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={`Rodapé: ${col.title}`}>
            <h2 className="font-serif text-sm font-semibold uppercase tracking-widest text-terra-800">
              {col.title}
            </h2>
            <ul className="mt-3 text-sm">
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

        <div>
          <h2 className="font-serif text-sm font-semibold uppercase tracking-widest text-terra-800">
            Contato
          </h2>
          <ul className="mt-3 text-sm">
            <li>
              <a
                href={whatsappLink("Olá! Gostaria de mais informações.")}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                WhatsApp: {site.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className={`${linkClass} break-all`}>
                {site.email}
              </a>
            </li>
            <li className="flex flex-wrap gap-x-4 pt-1">
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
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-night-900/10">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-night-800/75 sm:px-6">
          <p>
            © {new Date().getFullYear()} Igreja Pentecostal Missionária Nova
            Terra. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
