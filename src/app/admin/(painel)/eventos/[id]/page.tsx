import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import EventoForm, { type EventoExistente } from "@/components/admin/EventoForm";

export const metadata = {
  title: "Editar evento | Painel Admin",
};

async function getEvento(id: string): Promise<EventoExistente | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("eventos")
    .select(
      "id, slug, titulo, detalhe, descricao, categoria, imagem_url, inscricoes_abertas, publicado, ordem, gratuito, preco, palestrante, data_evento, hora_evento, patrocinadores"
    )
    .eq("id", id)
    .single();

  return data as EventoExistente | null;
}

export default async function EditarEventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const evento = await getEvento(id);
  if (!evento) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-night-900">
        Editar evento
      </h1>
      <div className="mt-6">
        <EventoForm evento={evento} />
      </div>
    </div>
  );
}
