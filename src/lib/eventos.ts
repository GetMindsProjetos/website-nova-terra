import { getSupabaseServerClient } from "@/lib/supabaseServer";

export type Patrocinador = {
  nome: string;
  logoUrl: string | null;
};

export type Evento = {
  slug: string;
  titulo: string;
  descricao: string;
  detalhe: string | null;
  categoria: "geral" | "empreendedores";
  imagemUrl: string | null;
  inscricoesAbertas: boolean;
  gratuito: boolean;
  preco: number | null;
  palestrante: string | null;
  dataEvento: string | null;
  horaEvento: string | null;
  patrocinadores: Patrocinador[];
};

const CAMPOS_EVENTO =
  "slug, titulo, descricao, detalhe, categoria, imagem_url, inscricoes_abertas, gratuito, preco, palestrante, data_evento, hora_evento, patrocinadores";

function mapRow(row: any): Evento {
  return {
    slug: row.slug,
    titulo: row.titulo,
    descricao: row.descricao,
    detalhe: row.detalhe,
    categoria: row.categoria,
    imagemUrl: row.imagem_url,
    inscricoesAbertas: row.inscricoes_abertas,
    gratuito: row.gratuito,
    preco: row.preco !== null ? Number(row.preco) : null,
    palestrante: row.palestrante,
    dataEvento: row.data_evento,
    horaEvento: row.hora_evento,
    patrocinadores: Array.isArray(row.patrocinadores) ? row.patrocinadores : [],
  };
}

export async function getEventos(): Promise<Evento[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("eventos")
    .select(CAMPOS_EVENTO)
    .eq("publicado", true)
    .order("ordem", { ascending: true });

  return (data ?? []).map(mapRow);
}

export async function getEventoBySlug(slug: string): Promise<Evento | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("eventos")
    .select(CAMPOS_EVENTO)
    .eq("slug", slug)
    .eq("publicado", true)
    .single();

  return data ? mapRow(data) : null;
}

export function isEventoEncerrado(evento: Evento) {
  if (evento.inscricoesAbertas || !evento.dataEvento) return false;
  const [ano, mes, dia] = evento.dataEvento.split("-").map(Number);
  return new Date(ano, mes - 1, dia) < new Date(new Date().toDateString());
}

export function formatPreco(preco: number) {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDataEvento(dataEvento: string) {
  const [ano, mes, dia] = dataEvento.split("-").map(Number);
  const data = new Date(ano, mes - 1, dia);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
