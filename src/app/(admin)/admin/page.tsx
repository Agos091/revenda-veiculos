import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metricas = [
  { label: "Disponíveis", valor: "—" },
  { label: "Reservados", valor: "—" },
  { label: "Vendidos no mês", valor: "—" },
  { label: "Cliques no WhatsApp", valor: "—" },
];

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Painel</h1>
          <p className="text-sm text-muted-foreground">
            Área do vendedor — tema claro.
          </p>
        </div>
        <Button>+ Novo veículo</Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricas.map((m) => (
          <Card key={m.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {m.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-3xl font-bold tabular-nums">{m.valor}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximo passo</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Fase 2 — login do vendedor, tabela de veículos e formulário de cadastro.
        </CardContent>
      </Card>
    </main>
  );
}
