import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import EmpresaForm, { type EmpresaExistente } from "@/components/admin/EmpresaForm";

export const metadata = {
  title: "Editar empresa | Painel Admin",
};

async function getEmpresa(id: string): Promise<EmpresaExistente | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("empresas")
    .select(
      "id, slug, nome, categoria, descricao, nome_responsavel, whatsapp, instagram, logo_url, capa_url, publicado, ordem"
    )
    .eq("id", id)
    .single();

  return data as EmpresaExistente | null;
}

export default async function EditarEmpresaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const empresa = await getEmpresa(id);
  if (!empresa) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-night-900">
        Editar empresa
      </h1>
      <div className="mt-6">
        <EmpresaForm empresa={empresa} />
      </div>
    </div>
  );
}
