import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import { modoDemo } from "@/lib/veiculos/demo";

/**
 * Renova a sessão em cada request e protege /admin.
 * Sem login, redireciona para /admin/login.
 */
export async function atualizarSessao(request: NextRequest) {
  let response = NextResponse.next({ request });

  // modo demo (só em desenvolvimento): não há Supabase para autenticar contra
  if (modoDemo()) return response;

  // Sem Supabase configurado o admin não funciona de qualquer forma:
  // em desenvolvimento deixa passar para dar pra abrir as telas; em produção falha alto.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
    }
    console.warn("[middleware] Supabase não configurado — /admin sem proteção (dev).");
    return response;
  }

  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // telas que precisam ficar acessíveis a quem não está logado
  const rotaDeLogin = pathname.startsWith("/admin/login");
  const rotaPublica =
    rotaDeLogin ||
    pathname.startsWith("/admin/recuperar-senha") ||
    pathname.startsWith("/admin/auth/callback");

  if (!user && pathname.startsWith("/admin") && !rotaPublica) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && (rotaDeLogin || pathname.startsWith("/admin/recuperar-senha"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
