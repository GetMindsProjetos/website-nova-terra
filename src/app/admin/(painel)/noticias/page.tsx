import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import NoticiasList, {
  type NoticiaLinha,
} from "@/components/admin/NoticiasList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Notícias | Painel Admin",
};

async function getNoticias(): Promise<NoticiaLinha[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("noticias")
    .select("id, slug, titulo, publicado, publicado_em")
    .order("publicado_em", { ascending: false });

  return (data ?? []) as NoticiaLinha[];
}

export default async function AdminNoticiasPage() {
  const noticias = await getNoticias();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-medium text-night-900">
          Notícias
        </h1>
        <Link
          href="/admin/noticias/novo"
          className="rounded-full bg-terra-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-terra-700"
        >
          Nova notícia
        </Link>
      </div>

      <div className="mt-6">
        <NoticiasList noticias={noticias} />
      </div>
    </div>
  );
}
