import { createClient as criarClienteSupabase } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Cliente anônimo, sem cookies — para as páginas públicas.
 *
 * Ler cookies obriga o Next a renderizar a cada request; sem eles o catálogo
 * pode ser cacheado e revalidado (ISR), que é mais rápido e mais barato.
 * As políticas de RLS de leitura pública continuam valendo.
 */
export function createClientePublico() {
  return criarClienteSupabase<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
