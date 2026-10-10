import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import EmpresasList, { type EmpresaLinha } from "@/components/admin/EmpresasList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Empresas | Painel Admin",
};

async function getEmpresas(): Promise<EmpresaLinha[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("empresas")
    .select("id, slug, nome, categoria, whatsapp, publicado, ordem")
    .order("ordem", { ascending: true });

  return (data ?? []) as EmpresaLinha[];
}

export default async function AdminEmpresasPage() {
  const empresas = await getEmpresas();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-medium text-night-900">
          Empresas
        </h1>
        <Link
          href="/admin/empresas/novo"
          className="rounded-full bg-terra-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-terra-700"
        >
          Nova empresa
        </Link>
      </div>

      <div className="mt-6">
        <EmpresasList empresas={empresas} />
      </div>
    </div>
  );
}
