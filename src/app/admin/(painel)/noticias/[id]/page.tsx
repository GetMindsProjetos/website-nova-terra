import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import NoticiaForm, {
  type NoticiaExistente,
} from "@/components/admin/NoticiaForm";

export const metadata = {
  title: "Editar notícia | Painel Admin",
};

async function getNoticia(id: string): Promise<NoticiaExistente | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("noticias")
    .select("id, slug, titulo, resumo, conteudo, imagem_url, publicado")
    .eq("id", id)
    .single();

  return data as NoticiaExistente | null;
}

export default async function EditarNoticiaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const noticia = await getNoticia(id);
  if (!noticia) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-night-900">
        Editar notícia
      </h1>
      <div className="mt-6">
        <NoticiaForm noticia={noticia} />
      </div>
    </div>
  );
}
