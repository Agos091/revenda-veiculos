/**
 * Variáveis de ambiente — ver .env.example.
 * Lidas por getter (lazy) para o build não quebrar quando só o site público é gerado.
 */
function obrigatoria(nome: string, valor: string | undefined): string {
  if (!valor) {
    throw new Error(
      `Variável de ambiente ${nome} não definida. Copie .env.example para .env.local.`,
    );
  }
  return valor;
}

export const env = {
  get supabaseUrl() {
    return obrigatoria("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
  },
  get supabaseAnonKey() {
    return obrigatoria(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  },
  get siteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  },
};
