import Image from "next/image";
import Link from "next/link";
import { ImageOff, Pencil, Plus } from "lucide-react";
import { listarVeiculosAdmin } from "@/lib/veiculos/queries";
import { formatarKm, formatarPreco, rotulo, tituloVeiculo } from "@/lib/format";
import type { StatusVeiculo, VeiculoComFotos } from "@/types/database";
import { BuscaVeiculos } from "@/components/admin/busca-veiculos";
import {
  BotaoExcluir,
  SelectStatus,
  ToggleDestaque,
} from "@/components/admin/acoes-veiculo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const ABAS: { valor: StatusVeiculo | "todos"; label: string }[] = [
  { valor: "todos", label: "Todos" },
  { valor: "disponivel", label: "Disponíveis" },
  { valor: "reservado", label: "Reservados" },
  { valor: "vendido", label: "Vendidos" },
  { valor: "inativo", label: "Inativos" },
];

function capa(veiculo: VeiculoComFotos) {
  const fotos = veiculo.fotos ?? [];
  return fotos.find((f) => f.is_capa) ?? fotos[0] ?? null;
}

export default async function ListaVeiculosPage({
  searchParams,
}: {
  searchParams: Promise<{ busca?: string; status?: string }>;
}) {
  const { busca, status } = await searchParams;
  const statusAtual = (status ?? "todos") as StatusVeiculo | "todos";

  let veiculos: VeiculoComFotos[] = [];
  let erro: string | null = null;

  try {
    veiculos = await listarVeiculosAdmin({ busca, status: statusAtual });
  } catch (e) {
    erro = e instanceof Error ? e.message : "Não foi possível carregar o estoque.";
  }

  const query = (novoStatus: string) => {
    const params = new URLSearchParams();
    if (busca) params.set("busca", busca);
    if (novoStatus !== "todos") params.set("status", novoStatus);
    const s = params.toString();
    return s ? `/admin/veiculos?${s}` : "/admin/veiculos";
  };

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Veículos</h1>
          <p className="text-sm text-muted-foreground">
            {veiculos.length} {veiculos.length === 1 ? "veículo" : "veículos"}
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/admin/veiculos/novo">
            <Plus className="size-4" />
            Novo veículo
          </Link>
        </Button>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <BuscaVeiculos />
        <div className="flex flex-wrap gap-1">
          {ABAS.map((aba) => (
            <Link
              key={aba.valor}
              href={query(aba.valor)}
              className={cn(
                "inline-flex h-8 items-center rounded-lg border px-3 text-sm transition-colors",
                statusAtual === aba.valor
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:bg-muted",
              )}
            >
              {aba.label}
            </Link>
          ))}
        </div>
      </div>

      {erro && (
        <Card className="border-destructive/40">
          <CardContent className="py-4 text-sm text-destructive">
            Não foi possível carregar o estoque: {erro}
          </CardContent>
        </Card>
      )}

      {!erro && veiculos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              {busca || statusAtual !== "todos"
                ? "Nenhum veículo com esses filtros."
                : "Nenhum veículo cadastrado ainda."}
            </p>
            <Button asChild variant="outline">
              <Link href="/admin/veiculos/novo">Cadastrar o primeiro</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[4.5rem]">Foto</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-right">Km</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Destaque</TableHead>
                <TableHead className="w-[5.5rem] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {veiculos.map((v) => {
                const foto = capa(v);
                const nome = `${tituloVeiculo(v)} ${v.ano_modelo}`;
                return (
                  <TableRow key={v.id}>
                    <TableCell>
                      <div className="relative size-12 overflow-hidden rounded-md bg-muted">
                        {foto ? (
                          <Image
                            src={foto.url}
                            alt={nome}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <ImageOff className="absolute inset-0 m-auto size-4 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/veiculos/${v.id}`}
                        className="font-medium hover:text-primary"
                      >
                        {nome}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {rotulo(v.cambio)} · {rotulo(v.combustivel)}
                        {v.cor ? ` · ${v.cor}` : ""}
                      </p>
                    </TableCell>
                    <TableCell className="text-right font-heading font-bold tabular-nums">
                      {formatarPreco(v.preco)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatarKm(v.km)}
                    </TableCell>
                    <TableCell>
                      <SelectStatus id={v.id} status={v.status} />
                    </TableCell>
                    <TableCell className="text-center">
                      <ToggleDestaque id={v.id} destaque={v.destaque} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon-sm">
                          <Link href={`/admin/veiculos/${v.id}`} aria-label={`Editar ${nome}`}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <BotaoExcluir id={v.id} nome={nome} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </main>
  );
}
