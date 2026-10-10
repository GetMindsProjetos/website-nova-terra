import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Protege todas as rotas /admin: exige usuário logado (Supabase Auth).
// Quem não estiver logado é redirecionado para /admin/login, e quem já
// estiver logado é tirado da tela de login e mandado para o painel.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Sem as chaves públicas configuradas, não dá pra checar autenticação.
  // Deixa passar para não derrubar o resto do site fora do /admin.
  if (!supabaseUrl || !supabaseAnonKey) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const { pathname } = request.nextUrl;

  // Erro do Supabase (rede, chave inválida) não derruba a rota: vira "sem
  // sessão" (o /admin redireciona para o login; o resto do site segue).
  let user: unknown = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  // Redireciona preservando cookies de sessão renovados em `response`
  // (padrão recomendado pelo @supabase/ssr) e sem indexação.
  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    redirect.headers.set("X-Robots-Tag", "noindex, nofollow");
    return redirect;
  };
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  const isLoginPage = pathname === "/admin/login";
  // Página de primeiro acesso (convite) — precisa ficar acessível mesmo
  // sem sessão ainda estabelecida, porque o token do convite só vira
  // sessão depois que o JS do navegador processa o link.
  const isSetPasswordPage = pathname === "/admin/definir-senha";

  if (!user && pathname.startsWith("/admin") && !isLoginPage && !isSetPasswordPage) {
    return redirectTo("/admin/login");
  }

  if (user && isLoginPage) {
    return redirectTo("/admin");
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
