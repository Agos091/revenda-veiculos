"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";

export interface ResultadoAcao {
  ok: boolean;
  erro?: string;
}

export async function entrar(
  _anterior: ResultadoAcao | null,
  formData: FormData,
): Promise<ResultadoAcao> {
  const email = String(formData.get("email") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");
  const destino = String(formData.get("next") ?? "/admin");

  if (!email || !senha) {
    return { ok: false, erro: "Preencha email e senha." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

  if (error) {
    return { ok: false, erro: "Email ou senha incorretos." };
  }

  redirect(destino.startsWith("/admin") ? destino : "/admin");
}

export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function enviarRecuperacao(
  _anterior: ResultadoAcao | null,
  formData: FormData,
): Promise<ResultadoAcao> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { ok: false, erro: "Informe o email." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${env.siteUrl}/admin/auth/callback?next=/admin/nova-senha`,
  });

  // não dizemos se o email existe ou não — isso vazaria quem tem conta
  if (error) console.error("[recuperacao]", error.message);

  return { ok: true };
}

/** Define a nova senha. Exige a sessão criada pelo link enviado por email. */
export async function redefinirSenha(
  _anterior: ResultadoAcao | null,
  formData: FormData,
): Promise<ResultadoAcao> {
  const senha = String(formData.get("senha") ?? "");
  const confirmacao = String(formData.get("confirmacao") ?? "");

  if (senha.length < 8) {
    return { ok: false, erro: "A senha precisa ter pelo menos 8 caracteres." };
  }
  if (senha !== confirmacao) {
    return { ok: false, erro: "As senhas não são iguais." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, erro: "O link expirou. Peça a recuperação de novo." };
  }

  const { error } = await supabase.auth.updateUser({ password: senha });
  if (error) return { ok: false, erro: error.message };

  redirect("/admin");
}
