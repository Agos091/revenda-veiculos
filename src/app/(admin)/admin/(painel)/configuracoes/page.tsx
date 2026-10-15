import { obterConfiguracoes } from "@/lib/veiculos/queries";
import type { Configuracoes } from "@/types/database";
import { FormularioConfiguracoes } from "@/components/admin/formulario-configuracoes";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  let configuracoes: Configuracoes | null = null;
  let erro: string | null = null;

  try {
    configuracoes = await obterConfiguracoes();
  } catch (e) {
    erro = e instanceof Error ? e.message : "Não foi possível carregar as configurações.";
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <header>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Dados da loja usados no site público e no link do WhatsApp.
        </p>
      </header>

      {erro && (
        <Card className="border-destructive/40">
          <CardContent className="py-4 text-sm text-destructive">{erro}</CardContent>
        </Card>
      )}

      <FormularioConfiguracoes configuracoes={configuracoes} />
    </main>
  );
}
