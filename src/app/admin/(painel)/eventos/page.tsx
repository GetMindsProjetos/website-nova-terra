import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import EventosList, { type EventoLinha } from "@/components/admin/EventosList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Eventos | Painel Admin",
};

async function getEventos(): Promise<EventoLinha[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("eventos")
    .select("id, slug, titulo, categoria, publicado, inscricoes_abertas, ordem")
    .order("ordem", { ascending: true });

  return (data ?? []) as EventoLinha[];
}

export default async function AdminEventosPage() {
  const eventos = await getEventos();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-medium text-night-900">
          Eventos
        </h1>
        <Link
          href="/admin/eventos/novo"
          className="rounded-full bg-terra-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-terra-700"
        >
          Novo evento
        </Link>
      </div>

      <div className="mt-6">
        <EventosList eventos={eventos} />
      </div>
    </div>
  );
}
