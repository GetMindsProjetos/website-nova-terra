"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { createClient } from "@/lib/supabase/server";

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

export async function excluirInscricao(id: string) {
  if (!(await temSessaoAdmin())) {
    return { error: "Sessão expirada. Entre novamente no painel." };
  }
  if (typeof id !== "string" || !UUID_REGEX.test(id)) {
    return { error: "Identificador inválido." };
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { error: "Conexão com o banco indisponível." };
  }

  const { error } = await (supabase.from("inscricoes") as any)
    .delete()
    .eq("id", id);

  if (error) {
    return { error: "Não foi possível excluir a inscrição." };
  }

  revalidatePath("/admin/inscritos");
  return { error: null };
}
