import { createElement } from "react";
import type { Metadata } from "next";
import { site } from "@/lib/site";

/** Domínio canônico (mesmo valor de metadataBase em app/layout.tsx). */
export const siteUrl = "https://igrejanovaterra.com.br";

export type OgImage =
  | string
  | { url: string; alt?: string; width?: number; height?: number };

/** Imagem de compartilhamento padrão (a mesma do layout). */
export const defaultOgImage = {
  url: "/hero/fachada-desktop.webp",
  alt: "Fachada da Igreja Nova Terra, em Icoaraci, Belém-PA",
};

type PageMetadataInput = {
  /** String: aplica o template "%s | Igreja Nova Terra". `{ absolute }` ignora o template. */
  title: string | { absolute: string };
  description: string;
  /** Caminho canônico, ex.: "/quem-somos". */
  path: string;
  image?: OgImage;
  type?: "website" | "article";
  publishedTime?: string;
  noindex?: boolean;
};

function normalizeImage(image?: OgImage) {
  if (!image) return defaultOgImage;
  return typeof image === "string" ? { url: image } : image;
}

/** Corta em limite de palavra, para não passar de ~160 caracteres. */
export function truncate(text: string, max = 160) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:\s]+$/, "")}…`;
}

/**
 * Metadata de página. O `openGraph` de página SUBSTITUI o do layout (merge raso),
 * por isso `images`, `siteName` e `locale` são sempre repetidos aqui.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  noindex,
}: PageMetadataInput): Metadata {
  const desc = truncate(description);
  const ogTitle =
    typeof title === "string" ? `${title} | ${site.name}` : title.absolute;
  const img = normalizeImage(image);

  const base = {
    title: ogTitle,
    description: desc,
    url: path,
    siteName: site.name,
    locale: "pt_BR",
    images: [img],
  };

  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph:
      type === "article"
        ? { ...base, type: "article", publishedTime }
        : { ...base, type: "website" },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: desc,
      images: [img.url],
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${siteUrl}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/** Serializa JSON-LD escapando "<" para impedir fechamento de <script>. */
export function jsonLd(obj: unknown) {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

/** Componente de servidor: `<JsonLd data={...} />`. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: jsonLd(data) },
  });
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * Church (home). Endereço extraído de site.address
 * ("Tv. S-7, 107 - Campina de Icoaraci, Belém - PA, 66813-300");
 * foundingDate corresponde a site.founded ("25 de janeiro de 2007").
 * E-mail fica de fora enquanto for LACUNA em site.ts.
 */
export function churchLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Church",
    "@id": `${siteUrl}/#igreja`,
    name: site.fullName,
    alternateName: site.name,
    url: siteUrl,
    image: absoluteUrl(defaultOgImage.url),
    telephone: `+${site.whatsapp}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Tv. S-7, 107",
      addressLocality: "Belém",
      addressRegion: "PA",
      postalCode: "66813-300",
      addressCountry: "BR",
    },
    foundingDate: "2007-01-25",
    sameAs: [site.social.instagram, site.social.facebook, site.social.youtube].filter(
      Boolean,
    ),
  };
}
