"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { optimizeImage } from "@/lib/imageProcessing";
import { createClient } from "@/lib/supabase/server";

export type EventoFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const MAX_PATROCINADORES = 5;
const MSG_SEM_SESSAO = "Sessão expirada. Entre novamente no painel.";
const MSG_ID_INVALIDO = "Identificador inválido.";
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CATEGORIAS_EVENTO = ["geral", "empreendedores"];

// Server Actions são endpoints POST públicos: não confiar só no middleware.
async function temSessaoAdmin(): Promise<boolean> {
  try {
    const client = await createClient();
    const {
      data: { user },
    } = await client.auth.getUser();
    return Boolean(user);
  } catch {
    return false;
  }
}

function texto(formData: FormData, nome: string): string {
  const v = formData.get(nome);
  return typeof v === "string" ? v.trim() : "";
}

function arquivo(formData: FormData, nome: string): File | null {
  const v = formData.get(nome);
  return v instanceof File ? v : null;
}

// Só aceita URLs do Storage público do próprio Supabase (o campo oculto
// "logo atual" vem do navegador e não é confiável).
function urlMidiaValida(url: string): string | null {
  const base = process.env.SUPABASE_URL;
  if (!url || url.length > 600 || !base) return null;
  const prefixo = `${base.replace(/\/+$/, "")}/storage/v1/object/public/`;
  return url.startsWith(prefixo) ? url : null;
}

function validarCampos(c: ReturnType<typeof lerCamposComuns>): string | null {
  if (!c.titulo || !c.slug || !c.descricao) {
    return "Preencha título, slug e descrição.";
  }
  if (c.titulo.length > 200) return "O título deve ter até 200 caracteres.";
  if (c.slug.length > 100) return "O slug deve ter até 100 caracteres.";
  if (c.detalhe.length > 200) return "O detalhe deve ter até 200 caracteres.";
  if (c.descricao.length > 5000) {
    return "A descrição deve ter até 5.000 caracteres.";
  }
  if (!CATEGORIAS_EVENTO.includes(c.categoria)) return "Categoria inválida.";
  if (c.palestrante.length > 200) {
    return "O palestrante deve ter até 200 caracteres.";
  }
  if (c.dataEvento.length > 40 || c.horaEvento.length > 40) {
    return "Data ou hora do evento inválida.";
  }
  if (!Number.isInteger(c.ordem) || Math.abs(c.ordem) > 100000) {
    return "Ordem inválida.";
  }
  if (
    c.preco !== null &&
    (!Number.isFinite(c.preco) || c.preco < 0 || c.preco > 1000000)
  ) {
    return "Valor do evento inválido.";
  }
  return null;
}

async function uploadImagemCapa(
  supabase: NonNullable<ReturnType<typeof getSupabaseServerClient>>,
  file: File | null,
  slug: string
) {
  if (!file || file.size === 0) return null;

  const { buffer, contentType, extensao } = await optimizeImage(file, {
    width: 1200,
    height: 900,
    fit: "cover",
    // WhatsApp/Facebook nao renderizam bem preview de og:image em WebP
    format: "jpeg",
    quality: 85,
  });
  const caminho = `eventos/${slug}-${Date.now()}.${extensao}`;

  const { error } = await supabase.storage
    .from("media")
    .upload(caminho, buffer, { upsert: true, contentType });

  if (error) {
    throw new Error("Não foi possível enviar a imagem.");
  }

  const { data } = supabase.storage.from("media").getPublicUrl(caminho);
  return data.publicUrl;
}

async function uploadLogoPatrocinador(
  supabase: NonNullable<ReturnType<typeof getSupabaseServerClient>>,
  file: File | null,
  slug: string,
  indice: number
) {
  if (!file || file.size === 0) return null;

  const { buffer, contentType, extensao } = await optimizeImage(file, {
    width: 300,
    height: 300,
    fit: "contain",
  });
  const caminho = `eventos/patrocinadores/${slug}-${indice}-${Date.now()}.${extensao}`;

  const { error } = await supabase.storage
    .from("media")
    .upload(caminho, buffer, { upsert: true, contentType });

  if (error) {
    throw new Error("Não foi possível enviar a logo do patrocinador.");
  }

  const { data } = supabase.storage.from("media").getPublicUrl(caminho);
  return data.publicUrl;
}

async function lerPatrocinadores(
  supabase: NonNullable<ReturnType<typeof getSupabaseServerClient>>,
  formData: FormData,
  slug: string
) {
  const patrocinadores: { nome: string; logoUrl: string | null }[] = [];

  for (let i = 1; i <= MAX_PATROCINADORES; i++) {
    const nome = texto(formData, `patrocinadorNome${i}`);
    if (!nome) continue;
    if (nome.length > 120) {
      throw new Error("O nome do patrocinador deve ter até 120 caracteres.");
    }

    const logoArquivo = arquivo(formData, `patrocinadorLogo${i}`);
    const logoAtual = urlMidiaValida(
      texto(formData, `patrocinadorLogoAtual${i}`)
    );

    const novoLogoUrl = await uploadLogoPatrocinador(
      supabase,
      logoArquivo,
      slug,
      i
    );
    patrocinadores.push({
      nome,
      logoUrl: novoLogoUrl || logoAtual || null,
    });
  }

  return patrocinadores;
}

function lerCamposComuns(formData: FormData) {
  return {
    titulo: texto(formData, "titulo"),
    slug: texto(formData, "slug")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-"),
    detalhe: texto(formData, "detalhe"),
    descricao: texto(formData, "descricao"),
    categoria: texto(formData, "categoria") || "geral",
    inscricoesAbertas: formData.get("inscricoesAbertas") === "on",
    publicado: formData.get("publicado") === "on",
    ordem: Number(texto(formData, "ordem") || 0),
    gratuito: formData.get("valorTipo") !== "pago",
    preco:
      formData.get("valorTipo") !== "pago"
        ? null
        : Number(texto(formData, "preco").replace(",", ".") || "0"),
    palestrante: texto(formData, "palestrante"),
    dataEvento: texto(formData, "dataEvento"),
    horaEvento: texto(formData, "horaEvento"),
  };
}

export async function criarEvento(
  _prevState: EventoFormState,
  formData: FormData
): Promise<EventoFormState> {
  if (!(await temSessaoAdmin())) {
    return { status: "error", message: MSG_SEM_SESSAO };
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { status: "error", message: "Conexão com o banco indisponível." };
  }

  const campos = lerCamposComuns(formData);
  const erroCampos = validarCampos(campos);
  if (erroCampos) {
    return { status: "error", message: erroCampos };
  }

  let imagemUrl: string | null = null;
  let patrocinadores: { nome: string; logoUrl: string | null }[] = [];
  try {
    const imagemFile = arquivo(formData, "imagem");
    imagemUrl = await uploadImagemCapa(supabase, imagemFile, campos.slug);
    patrocinadores = await lerPatrocinadores(supabase, formData, campos.slug);
  } catch (e) {
    return { status: "error", message: (e as Error).message };
  }

  const { error } = await (supabase.from("eventos") as any).insert({
    slug: campos.slug,
    titulo: campos.titulo,
    detalhe: campos.detalhe || null,
    descricao: campos.descricao,
    categoria: campos.categoria,
    inscricoes_abertas: campos.inscricoesAbertas,
    publicado: campos.publicado,
    ordem: campos.ordem,
    gratuito: campos.gratuito,
    preco: campos.preco,
    palestrante: campos.palestrante || null,
    data_evento: campos.dataEvento || null,
    hora_evento: campos.horaEvento || null,
    patrocinadores,
    ...(imagemUrl ? { imagem_url: imagemUrl } : {}),
  });

  if (error) {
    return {
      status: "error",
      message:
        "Não foi possível criar o evento. Verifique se o slug já está em uso.",
    };
  }

  revalidatePath("/admin/eventos");
  revalidatePath("/eventos");
  return { status: "success" };
}

export async function atualizarEvento(
  id: string,
  _prevState: EventoFormState,
  formData: FormData
): Promise<EventoFormState> {
  if (!(await temSessaoAdmin())) {
    return { status: "error", message: MSG_SEM_SESSAO };
  }
  if (typeof id !== "string" || !UUID_REGEX.test(id)) {
    return { status: "error", message: MSG_ID_INVALIDO };
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { status: "error", message: "Conexão com o banco indisponível." };
  }

  const campos = lerCamposComuns(formData);
  const erroCampos = validarCampos(campos);
  if (erroCampos) {
    return { status: "error", message: erroCampos };
  }

  let imagemUrl: string | null = null;
  let patrocinadores: { nome: string; logoUrl: string | null }[] = [];
  try {
    const imagemFile = arquivo(formData, "imagem");
    imagemUrl = await uploadImagemCapa(supabase, imagemFile, campos.slug);
    patrocinadores = await lerPatrocinadores(supabase, formData, campos.slug);
  } catch (e) {
    return { status: "error", message: (e as Error).message };
  }

  const { error } = await (supabase.from("eventos") as any)
    .update({
      slug: campos.slug,
      titulo: campos.titulo,
      detalhe: campos.detalhe || null,
      descricao: campos.descricao,
      categoria: campos.categoria,
      inscricoes_abertas: campos.inscricoesAbertas,
      publicado: campos.publicado,
      ordem: campos.ordem,
      gratuito: campos.gratuito,
      preco: campos.preco,
      palestrante: campos.palestrante || null,
      data_evento: campos.dataEvento || null,
      hora_evento: campos.horaEvento || null,
      patrocinadores,
      ...(imagemUrl ? { imagem_url: imagemUrl } : {}),
    })
    .eq("id", id);

  if (error) {
    return {
      status: "error",
      message:
        "Não foi possível salvar o evento. Verifique se o slug já está em uso.",
    };
  }

  revalidatePath("/admin/eventos");
  revalidatePath("/eventos");
  return { status: "success" };
}

export async function excluirEvento(id: string) {
  if (!(await temSessaoAdmin())) {
    return { error: MSG_SEM_SESSAO };
  }
  if (typeof id !== "string" || !UUID_REGEX.test(id)) {
    return { error: MSG_ID_INVALIDO };
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { error: "Conexão com o banco indisponível." };
  }

  const { error } = await (supabase.from("eventos") as any)
    .delete()
    .eq("id", id);

  if (error) {
    return { error: "Não foi possível excluir o evento." };
  }

  revalidatePath("/admin/eventos");
  revalidatePath("/eventos");
  return { error: null };
}
