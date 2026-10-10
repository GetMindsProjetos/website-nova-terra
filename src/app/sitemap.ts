import type { MetadataRoute } from "next";
import { redes } from "@/lib/redes";
import { getEventos } from "@/lib/eventos";
import { getNoticias } from "@/lib/noticias";
import { siteUrl } from "@/lib/seo";

export const revalidate = 3600;

// /como-ajudar e /contato são redirecionamentos permanentes (para /como-doar e
// /fale-conosco): ficam fora do sitemap de propósito.
const staticRoutes: {
  path: string;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/quem-somos", changeFrequency: "monthly", priority: 0.8 },
  { path: "/quem-somos/historia", changeFrequency: "yearly", priority: 0.5 },
  { path: "/quem-somos/fe", changeFrequency: "yearly", priority: 0.5 },
  { path: "/quem-somos/missao-e-visao", changeFrequency: "yearly", priority: 0.5 },
  { path: "/quem-somos/lideranca", changeFrequency: "yearly", priority: 0.5 },
  { path: "/jornada-de-discipulado", changeFrequency: "monthly", priority: 0.8 },
  {
    path: "/jornada-de-discipulado/discipulado-na-mesa",
    changeFrequency: "monthly",
    priority: 0.6,
  },
  { path: "/redes", changeFrequency: "monthly", priority: 0.8 },
  { path: "/casa-amarela", changeFrequency: "monthly", priority: 0.7 },
  { path: "/eventos", changeFrequency: "weekly", priority: 0.8 },
  { path: "/empreendedores", changeFrequency: "weekly", priority: 0.6 },
  { path: "/como-doar", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.6 },
  { path: "/fale-conosco", changeFrequency: "monthly", priority: 0.7 },
  { path: "/politica-de-privacidade", changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // lastModified omitido nas rotas estáticas: não há data real de edição.
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${siteUrl}${r.path}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const redeEntries: MetadataRoute.Sitemap = redes.map((r) => ({
    url: `${siteUrl}/redes/${r.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Conteúdo dinâmico (Supabase, somente publicados). Sem env ou com falha,
  // as funções retornam [] / lançam e o sitemap segue com a lista estática.
  let eventoEntries: MetadataRoute.Sitemap = [];
  try {
    const eventos = await getEventos();
    eventoEntries = eventos.map((e) => ({
      url: `${siteUrl}/eventos/${e.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    eventoEntries = [];
  }

  let noticiaEntries: MetadataRoute.Sitemap = [];
  try {
    const noticias = await getNoticias();
    noticiaEntries = noticias.map((n) => {
      const data = new Date(n.publicadoEm);
      return {
        url: `${siteUrl}/blog/${n.slug}`,
        ...(Number.isNaN(data.getTime()) ? {} : { lastModified: data }),
        changeFrequency: "yearly" as const,
        priority: 0.5,
      };
    });
  } catch {
    noticiaEntries = [];
  }

  return [...staticEntries, ...redeEntries, ...eventoEntries, ...noticiaEntries];
}
