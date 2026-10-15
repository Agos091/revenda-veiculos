import Link from "next/link";
import { CheckCircle2, Clock, MessageCircle, Plus, Tag } from "lucide-react";
import { obterMetricas, type MetricasDashboard } from "@/lib/veiculos/queries";
import { formatarKm, formatarPreco, rotulo, tituloVeiculo } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function PainelPage() {
  let metricas: MetricasDashboard | null = null;
  let erro: string | null = null;

  try {
    metricas = await obterMetricas();
  } catch (e) {
    erro = e instanceof Error ? e.message : "Não foi possível carregar os dados.";
  }

  const cards = [
    { label: "Disponíveis", valor: metricas?.disponiveis, icone: Tag },
    { label: "Reservados", valor: metricas?.reservados, icone: Clock },
    { label: "Vendidos no mês", valor: metricas?.vendidosNoMes, icone: CheckCircle2 },
    { label: "Cliques no WhatsApp (7d)", valor: metricas?.cliquesNaSemana, icone: MessageCircle },
  ];

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Painel</h1>
          <p className="text-sm text-muted-foreground">Resumo do estoque</p>
        </div>
        <Button asChild size="lg">
          <Link href="/admin/veiculos/novo">
            <Plus className="size-4" />
            Novo veículo
          </Link>
        </Button>
      </header>

      {erro && (
        <Card className="border-destructive/40">
          <CardContent className="py-4 text-sm text-destructive">
            Não foi possível carregar os dados do Supabase: {erro}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, valor, icone: Icone }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icone className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="font-heading text-3xl font-bold tabular-nums">
                {valor ?? "—"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Últimos cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {!metricas?.ultimos.length ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nenhum veículo cadastrado ainda.
            </p>
          ) : (
            <ul className="divide-y">
              {metricas.ultimos.map((v) => (
                <li key={v.id} className="flex items-center gap-4 py-3">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/veiculos/${v.id}`}
                      className="truncate font-medium hover:text-primary"
                    >
                      {tituloVeiculo(v)} {v.ano_modelo}
                    </Link>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {formatarKm(v.km)} · {rotulo(v.cambio)} · {rotulo(v.combustivel)}
                    </p>
                  </div>
                  <Badge variant={v.status === "disponivel" ? "default" : "secondary"}>
                    {rotulo(v.status)}
                  </Badge>
                  <span className="font-heading font-bold tabular-nums">
                    {formatarPreco(v.preco)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
