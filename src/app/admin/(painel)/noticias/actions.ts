"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { optimizeImage } from "@/lib/imageProcessing";
import { createClient } from "@/lib/supabase/server";

export type NoticiaFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const MSG_SEM_SESSAO = "Sessão expirada. Entre novamente no painel.";
const MSG_ID_INVALIDO = "Identificador inválido.";
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

function validarCampos(c: ReturnType<typeof lerCamposComuns>): string | null {
  if (!c.titulo || !c.slug || !c.resumo || !c.conteudo) {
    return "Preencha título, slug, resumo e conteúdo.";
  }
  if (c.titulo.length > 200) return "O título deve ter até 200 caracteres.";
  if (c.slug.length > 100) return "O slug deve ter até 100 caracteres.";
  if (c.resumo.length > 500) return "O resumo deve ter até 500 caracteres.";
  if (c.conteudo.length > 50000) {
    return "O conteúdo deve ter até 50.000 caracteres.";
  }
  return null;
}

async function uploadImagem(
  supabase: NonNullable<ReturnType<typeof getSupabaseServerClient>>,
  file: File | null,
  slug: string
) {
  if (!file || file.size === 0) return null;

  const { buffer, contentType, extensao } = await optimizeImage(file, {
    width: 1600,
    fit: "inside",
  });
  const caminho = `noticias/${slug}-${Date.now()}.${extensao}`;

  const { error } = await supabase.storage
    .from("media")
    .upload(caminho, buffer, { upsert: true, contentType });

  if (error) {
    throw new Error("Não foi possível enviar a imagem.");
  }

  const { data } = supabase.storage.from("media").getPublicUrl(caminho);
  return data.publicUrl;
}

function lerCamposComuns(formData: FormData) {
  return {
    titulo: texto(formData, "titulo"),
    slug: texto(formData, "slug")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-"),
    resumo: texto(formData, "resumo"),
    conteudo: texto(formData, "conteudo"),
    publicado: formData.get("publicado") === "on",
  };
}

export async function criarNoticia(
  _prevState: NoticiaFormState,
  formData: FormData
): Promise<NoticiaFormState> {
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
  try {
    imagemUrl = await uploadImagem(
      supabase,
      arquivo(formData, "imagem"),
      campos.slug
    );
  } catch (e) {
    return { status: "error", message: (e as Error).message };
  }

  const { error } = await (supabase.from("noticias") as any).insert({
    slug: campos.slug,
    titulo: campos.titulo,
    resumo: campos.resumo,
    conteudo: campos.conteudo,
    publicado: campos.publicado,
    ...(imagemUrl ? { imagem_url: imagemUrl } : {}),
  });

  if (error) {
    return {
      status: "error",
      message:
        "Não foi possível criar a notícia. Verifique se o slug já está em uso.",
    };
  }

  revalidatePath("/admin/noticias");
  revalidatePath("/blog");
  return { status: "success" };
}

export async function atualizarNoticia(
  id: string,
  _prevState: NoticiaFormState,
  formData: FormData
): Promise<NoticiaFormState> {
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
  try {
    imagemUrl = await uploadImagem(
      supabase,
      arquivo(formData, "imagem"),
      campos.slug
    );
  } catch (e) {
    return { status: "error", message: (e as Error).message };
  }

  const { error } = await (supabase.from("noticias") as any)
    .update({
      slug: campos.slug,
      titulo: campos.titulo,
      resumo: campos.resumo,
      conteudo: campos.conteudo,
      publicado: campos.publicado,
      ...(imagemUrl ? { imagem_url: imagemUrl } : {}),
    })
    .eq("id", id);

  if (error) {
    return {
      status: "error",
      message:
        "Não foi possível salvar a notícia. Verifique se o slug já está em uso.",
    };
  }

  revalidatePath("/admin/noticias");
  revalidatePath("/blog");
  return { status: "success" };
}

export async function excluirNoticia(id: string) {
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

  const { error } = await (supabase.from("noticias") as any)
    .delete()
    .eq("id", id);

  if (error) {
    return { error: "Não foi possível excluir a notícia." };
  }

  revalidatePath("/admin/noticias");
  revalidatePath("/blog");
  return { error: null };
}
