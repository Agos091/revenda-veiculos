"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) return { ok: false, erro: error.message };

  return { ok: true };
}
