"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { optimizeImage } from "@/lib/imageProcessing";
import { createClient } from "@/lib/supabase/server";

export type EmpresaFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

async function uploadImagem(
  supabase: NonNullable<ReturnType<typeof getSupabaseServerClient>>,
  file: File | null,
  pasta: string,
  slug: string
) {
  if (!file || file.size === 0) return null;

  const { buffer, contentType, extensao } = await optimizeImage(
    file,
    pasta === "logo"
      ? { width: 400, height: 400, fit: "cover" }
      : { width: 1200, fit: "inside" }
  );
  const caminho = `empresas/${pasta}/${slug}-${Date.now()}.${extensao}`;

  const { error } = await supabase.storage
    .from("media")
    .upload(caminho, buffer, { upsert: true, contentType });

  if (error) {
    throw new Error("Não foi possível enviar a imagem.");
  }

  const { data } = supabase.storage.from("media").getPublicUrl(caminho);
  return data.publicUrl;
}

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

function lerCamposComuns(formData: FormData) {
  return {
    nome: texto(formData, "nome"),
    slug: texto(formData, "slug")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-"),
    categoria: texto(formData, "categoria") || "outros",
    descricao: texto(formData, "descricao"),
    nomeResponsavel: texto(formData, "nomeResponsavel"),
    whatsapp: texto(formData, "whatsapp").replace(/\D/g, ""),
    instagram: texto(formData, "instagram"),
    publicado: formData.get("publicado") === "on",
    ordem: Number(texto(formData, "ordem") || 0),
  };
}

function validarCampos(c: ReturnType<typeof lerCamposComuns>): string | null {
  if (!c.nome || !c.slug || !c.descricao || !c.whatsapp) {
    return "Preencha nome, slug, descrição e WhatsApp.";
  }
  if (c.nome.length > 120) return "O nome deve ter até 120 caracteres.";
  if (c.slug.length > 100) return "O slug deve ter até 100 caracteres.";
  if (c.categoria.length > 40 || !/^[a-z0-9_-]+$/i.test(c.categoria)) {
    return "Categoria inválida.";
  }
  if (c.descricao.length > 2000) {
    return "A descrição deve ter até 2.000 caracteres.";
  }
  if (c.nomeResponsavel.length > 120) {
    return "O nome do responsável deve ter até 120 caracteres.";
  }
  if (c.whatsapp.length < 10 || c.whatsapp.length > 15) {
    return "Informe um WhatsApp válido, com DDD.";
  }
  if (c.instagram.length > 100) {
    return "O Instagram deve ter até 100 caracteres.";
  }
  if (!Number.isInteger(c.ordem) || Math.abs(c.ordem) > 100000) {
    return "Ordem inválida.";
  }
  return null;
}

export async function criarEmpresa(
  _prevState: EmpresaFormState,
  formData: FormData
): Promise<EmpresaFormState> {
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

  let logoUrl: string | null = null;
  let capaUrl: string | null = null;
  try {
    const logoFile = arquivo(formData, "logo");
    const capaFile = arquivo(formData, "capa");
    logoUrl = await uploadImagem(supabase, logoFile, "logo", campos.slug);
    capaUrl = await uploadImagem(supabase, capaFile, "capa", campos.slug);
  } catch (e) {
    return { status: "error", message: (e as Error).message };
  }

  const { error } = await (supabase.from("empresas") as any).insert({
    slug: campos.slug,
    nome: campos.nome,
    categoria: campos.categoria,
    descricao: campos.descricao,
    nome_responsavel: campos.nomeResponsavel || null,
    whatsapp: campos.whatsapp,
    instagram: campos.instagram || null,
    publicado: campos.publicado,
    ordem: campos.ordem,
    ...(logoUrl ? { logo_url: logoUrl } : {}),
    ...(capaUrl ? { capa_url: capaUrl } : {}),
  });

  if (error) {
    return {
      status: "error",
      message:
        "Não foi possível cadastrar a empresa. Verifique se o slug já está em uso.",
    };
  }

  revalidatePath("/admin/empresas");
  revalidatePath("/empreendedores");
  return { status: "success" };
}

export async function atualizarEmpresa(
  id: string,
  _prevState: EmpresaFormState,
  formData: FormData
): Promise<EmpresaFormState> {
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

  let logoUrl: string | null = null;
  let capaUrl: string | null = null;
  try {
    const logoFile = arquivo(formData, "logo");
    const capaFile = arquivo(formData, "capa");
    logoUrl = await uploadImagem(supabase, logoFile, "logo", campos.slug);
    capaUrl = await uploadImagem(supabase, capaFile, "capa", campos.slug);
  } catch (e) {
    return { status: "error", message: (e as Error).message };
  }

  const { error } = await (supabase.from("empresas") as any)
    .update({
      slug: campos.slug,
      nome: campos.nome,
      categoria: campos.categoria,
      descricao: campos.descricao,
      nome_responsavel: campos.nomeResponsavel || null,
      whatsapp: campos.whatsapp,
      instagram: campos.instagram || null,
      publicado: campos.publicado,
      ordem: campos.ordem,
      ...(logoUrl ? { logo_url: logoUrl } : {}),
      ...(capaUrl ? { capa_url: capaUrl } : {}),
    })
    .eq("id", id);

  if (error) {
    return {
      status: "error",
      message:
        "Não foi possível salvar a empresa. Verifique se o slug já está em uso.",
    };
  }

  revalidatePath("/admin/empresas");
  revalidatePath("/empreendedores");
  return { status: "success" };
}

export async function excluirEmpresa(id: string) {
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

  const { error } = await (supabase.from("empresas") as any)
    .delete()
    .eq("id", id);

  if (error) {
    return { error: "Não foi possível excluir a empresa." };
  }

  revalidatePath("/admin/empresas");
  revalidatePath("/empreendedores");
  return { error: null };
}
