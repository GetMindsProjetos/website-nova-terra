import { redes } from "@/lib/redes";

export const site = {
  name: "Igreja Nova Terra",
  fullName: "Igreja Pentecostal Missionária Nova Terra",
  city: "Icoaraci, Belém-PA",
  address: "Tv. S-7, 107 - Campina de Icoaraci, Belém - PA, 66813-300",
  whatsapp: "5591996088508",
  whatsappDisplay: "(91) 99608-8508",
  // LACUNA: confirmar e-mail oficial
  email: "contato@igrejanovaterra.com.br",
  pix: {
    chave: "08.892.504/0001-75",
    tipoChave: "CNPJ",
    nome: "Yracy Couto Bezerra Saraiva",
    banco: "Sicoob",
    qrcode: "/qrcode-pix.webp",
  },
  cultos: [
    { label: "Culto da Família (manhã)", quando: "Domingos, 08h30" },
    { label: "Culto da Família (noite)", quando: "Domingos, 18h30" },
    { label: "JAVAN — Rede Jovem", quando: "Sábados, 19h" },
  ],
  social: {
    instagram: "https://www.instagram.com/novaterrabelem/",
    // LACUNA: confirmar link do YouTube
    youtube: "",
    facebook: "https://www.facebook.com/profile.php?id=61592750885655",
  },
  founded: "25 de janeiro de 2007",
  closing: "Deus abençoe a cada um!",
};

export type NavChild = { href: string; label: string; description?: string };
export type NavItem = {
  href: string;
  label: string;
  description?: string;
  children?: NavChild[];
};

export const mainNav: NavItem[] = [
  { href: "/", label: "Home" },
  {
    href: "/quem-somos",
    label: "Quem Somos",
    description: "Nossa história, fé e liderança.",
    children: [
      {
        href: "/quem-somos/historia",
        label: "Nossa História",
        description: "Como a Nova Terra começou.",
      },
      {
        href: "/quem-somos/fe",
        label: "Nossa Fé",
        description: "O que cremos.",
      },
      {
        href: "/quem-somos/missao-e-visao",
        label: "Missão e Visão",
        description: "Para onde caminhamos.",
      },
      {
        href: "/quem-somos/lideranca",
        label: "Liderança",
        description: "Quem caminha à frente.",
      },
    ],
  },
  {
    href: "/redes",
    label: "Redes",
    description: "17 frentes de serviço, cuidado e crescimento.",
    children: [
      {
        href: "/jornada-de-discipulado/discipulado-na-mesa",
        label: "Discipulado na Mesa",
        description: "O que é e como participar.",
      },
      ...redes.map((rede) => ({
        href: `/redes/${rede.slug}`,
        label: rede.nome,
      })),
    ],
  },
  { href: "/casa-amarela", label: "Projeto Casa Amarela" },
  { href: "/eventos", label: "Eventos" },
  { href: "/empreendedores", label: "Empreendedores" },
  { href: "/como-doar", label: "Como Doar" },
  { href: "/blog", label: "Notícias" },
  { href: "/fale-conosco", label: "Fale Conosco" },
];

export const donateHref = "/como-doar";

/** Item de doação: renderizado como CTA/pílula, fora das listas de links. */
export const donateItem = mainNav.find((i) => i.href === donateHref)!;

/** Navegação sem o CTA de doação (desktop e drawer). */
export const desktopNav: NavItem[] = mainNav.filter((i) => i.href !== donateHref);

function pick(hrefs: string[]): NavItem[] {
  return hrefs
    .map((h) => mainNav.find((i) => i.href === h))
    .filter((i): i is NavItem => Boolean(i));
}

/** Agrupamento visual do drawer; nenhum link some. */
export const navGroups: { label: string; items: NavItem[] }[] = [
  { label: "Conheça", items: pick(["/", "/quem-somos", "/redes", "/casa-amarela"]) },
  { label: "Participe", items: pick(["/eventos", "/empreendedores"]) },
  { label: "Informação", items: pick(["/blog", "/fale-conosco"]) },
];

/** Redes sociais com URL preenchida (lacunas não renderizam link morto). */
export const socialLinks: { label: string; href: string }[] = [
  { label: "Instagram", href: site.social.instagram },
  { label: "YouTube", href: site.social.youtube },
  { label: "Facebook", href: site.social.facebook },
].filter((s) => Boolean(s.href));

/** Rota atual: "/" só exato; demais, exato ou subrota. */
export function isCurrent(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function whatsappLink(message: string) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${site.whatsapp}?text=${text}`;
}
