import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

async function getCounts() {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { inscritos: null, eventos: null, noticias: null, empresas: null };
  }

  const [inscritos, eventos, noticias, empresas] = await Promise.all([
    supabase.from("inscricoes").select("id", { count: "exact", head: true }),
    supabase.from("eventos").select("id", { count: "exact", head: true }),
    supabase.from("noticias").select("id", { count: "exact", head: true }),
    supabase.from("empresas").select("id", { count: "exact", head: true }),
  ]);

  return {
    inscritos: inscritos.count,
    eventos: eventos.count,
    noticias: noticias.count,
    empresas: empresas.count,
  };
}

export default async function AdminHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const counts = await getCounts();

  const cards = [
    {
      label: "Inscritos em eventos",
      value: counts.inscritos,
      href: "/admin/inscritos",
    },
    {
      label: "Eventos cadastrados",
      value: counts.eventos,
      href: "/admin/eventos",
    },
    {
      label: "Notícias publicadas",
      value: counts.noticias,
      href: "/admin/noticias",
    },
    {
      label: "Empresas cadastradas",
      value: counts.empresas,
      href: "/admin/empresas",
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-night-900">
        Bem-vindo{user?.email ? `, ${user.email}` : ""}
      </h1>
      <p className="mt-2 text-sm text-night-800/70">
        Use o menu para gerenciar inscritos, eventos, notícias e empresas.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-terra-100 bg-white p-6 transition hover:border-terra-300 hover:shadow-sm"
          >
            <p className="text-3xl font-medium text-terra-600">
              {card.value ?? "—"}
            </p>
            <p className="mt-1 text-sm text-night-800/70">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
