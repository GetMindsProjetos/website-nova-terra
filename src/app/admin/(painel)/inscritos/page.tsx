import { getSupabaseServerClient } from "@/lib/supabaseServer";
import InscritosTable, {
  type Inscricao,
} from "@/components/admin/InscritosTable";

export const metadata = {
  title: "Inscritos | Painel Admin",
};

async function getEventosComInscricoes() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("eventos")
    .select("slug, titulo")
    .order("ordem", { ascending: true });

  return (data ?? []) as { slug: string; titulo: string }[];
}

async function getInscricoes(eventoSlug?: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  let query = supabase
    .from("inscricoes")
    .select(
      "id, created_at, evento_slug, evento_titulo, nome, email, telefone, endereco, membro, segmento"
    )
    .order("created_at", { ascending: false });

  if (eventoSlug) {
    query = query.eq("evento_slug", eventoSlug);
  }

  const { data } = await query;
  return (data ?? []) as Inscricao[];
}

export default async function InscritosPage({
  searchParams,
}: {
  searchParams: Promise<{ evento?: string }>;
}) {
  const { evento } = await searchParams;
  const [eventos, inscricoes] = await Promise.all([
    getEventosComInscricoes(),
    getInscricoes(evento),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl font-medium text-night-900">
          Inscritos
        </h1>

        <form className="flex items-center gap-2">
          <select
            name="evento"
            defaultValue={evento ?? ""}
            className="rounded-lg border border-terra-200 px-3 py-2 text-sm focus:border-terra-500 focus:outline-none focus:ring-1 focus:ring-terra-500"
          >
            <option value="">Todos os eventos</option>
            {eventos.map((e) => (
              <option key={e.slug} value={e.slug}>
                {e.titulo}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg border border-terra-200 px-4 py-2 text-sm font-medium text-night-800 transition hover:border-terra-400 hover:text-terra-700"
          >
            Filtrar
          </button>
        </form>
      </div>

      <div className="mt-6">
        <InscritosTable inscricoes={inscricoes} />
      </div>
    </div>
  );
}
