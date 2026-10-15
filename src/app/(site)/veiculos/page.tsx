import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  listarMarcas,
  listarVeiculosPublico,
  POR_PAGINA,
  type FiltrosPublicos,
  type Ordenacao,
} from "@/lib/veiculos/publico";
import type { Cambio, Carroceria, Combustivel, VeiculoComFotos } from "@/types/database";
import { CardVeiculo } from "@/components/site/card-veiculo";
import { FiltrosVeiculos } from "@/components/site/filtros-veiculos";
import { FiltrosMobile, OrdenarSelect } from "@/components/site/barra-listagem";
import {
  AtalhosDeFiltro,
  BuscaEstoque,
  ChipsAtivos,
} from "@/components/site/busca-estoque";
import { obterConfiguracoesPublicas } from "@/lib/veiculos/publico";
import { env } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Estoque de seminovos",
  description:
    "Veja todos os carros disponíveis, filtre por marca, preço, ano, km e câmbio e fale com a gente no WhatsApp.",
};

type Params = Record<string, string | string[] | undefined>;

function texto(params: Params, chave: string): string | undefined {
  const valor = params[chave];
  const s = Array.isArray(valor) ? valor[0] : valor;
  return s?.trim() ? s.trim() : undefined;
}

function numero(params: Params, chave: string): number | undefined {
  const s = texto(params, chave);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

function umDe<T extends string>(valor: string | undefined, opcoes: readonly T[]): T | undefined {
  return valor && (opcoes as readonly string[]).includes(valor) ? (valor as T) : undefined;
}

const CAMBIOS = ["manual", "automatico", "automatizado", "cvt"] as const;
const COMBUSTIVEIS = [
  "flex",
  "gasolina",
  "etanol",
  "diesel",
  "hibrido",
  "eletrico",
] as const;
const CARROCERIAS = ["hatch", "sedan", "suv", "picape", "van", "coupe"] as const;
const ORDENACOES = [
  "recentes",
  "menor-preco",
  "maior-preco",
  "mais-novo",
  "menor-km",
] as const;

function lerFiltros(params: Params): FiltrosPublicos {
  return {
    busca: texto(params, "busca"),
    marca: texto(params, "marca"),
    precoMin: numero(params, "precoMin"),
    precoMax: numero(params, "precoMax"),
    anoMin: numero(params, "anoMin"),
    anoMax: numero(params, "anoMax"),
    kmMax: numero(params, "kmMax"),
    cambio: umDe<Cambio>(texto(params, "cambio"), CAMBIOS),
    combustivel: umDe<Combustivel>(texto(params, "combustivel"), COMBUSTIVEIS),
    carroceria: umDe<Carroceria>(texto(params, "carroceria"), CARROCERIAS),
    aceitaTroca: texto(params, "troca") === "1",
    aceitaFinanciamento: texto(params, "financiamento") === "1",
    ordenar: umDe<Ordenacao>(texto(params, "ordenar"), ORDENACOES),
    pagina: numero(params, "pagina") ?? 1,
  };
}

export default async function ListagemPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const params = await searchParams;
  const filtros = lerFiltros(params);

  let veiculos: VeiculoComFotos[] = [];
  let total = 0;
  let marcas: string[] = [];
  let erro: string | null = null;

  const configuracoes = await obterConfiguracoesPublicas().catch(() => null);
  const whatsapp = configuracoes?.whatsapp ?? "";

  try {
    const [resultado, listaDeMarcas] = await Promise.all([
      listarVeiculosPublico(filtros),
      listarMarcas(),
    ]);
    veiculos = resultado.veiculos;
    total = resultado.total;
    marcas = listaDeMarcas;
  } catch (e) {
    erro = e instanceof Error ? e.message : "Não foi possível carregar o estoque.";
  }

  const pagina = filtros.pagina ?? 1;
  const paginas = Math.max(1, Math.ceil(total / POR_PAGINA));

  const linkDaPagina = (n: number) => {
    const p = new URLSearchParams();
    for (const [chave, valor] of Object.entries(params)) {
      const s = Array.isArray(valor) ? valor[0] : valor;
      if (s && chave !== "pagina") p.set(chave, s);
    }
    if (n > 1) p.set("pagina", String(n));
    const query = p.toString();
    return query ? `/veiculos?${query}` : "/veiculos";
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6 space-y-5">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">Estoque</h1>
          <p className="mt-1 text-sm text-muted-foreground tabular-nums">
            {total} {total === 1 ? "veículo disponível" : "veículos disponíveis"}
          </p>
        </div>

        <Suspense fallback={null}>
          <BuscaEstoque className="max-w-xl" />
        </Suspense>

        <div className="-mx-4 overflow-x-auto px-4">
          <Suspense fallback={null}>
            <AtalhosDeFiltro />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <ChipsAtivos />
        </Suspense>
      </header>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="hidden w-64 shrink-0 lg:block">
          <Suspense fallback={null}>
            <FiltrosVeiculos marcas={marcas} />
          </Suspense>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Suspense fallback={null}>
              <FiltrosMobile marcas={marcas} />
            </Suspense>
            <Suspense fallback={null}>
              <OrdenarSelect />
            </Suspense>
          </div>

          {erro && (
            <p className="rounded-xl border border-destructive/40 p-4 text-sm text-destructive">
              Não foi possível carregar o estoque: {erro}
            </p>
          )}

          {!erro && veiculos.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-20 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhum veículo com esses filtros.
              </p>
              <Button asChild variant="outline">
                <Link href="/veiculos">Limpar filtros</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {veiculos.map((v, i) => (
                <CardVeiculo
                  key={v.id}
                  veiculo={v}
                  whatsapp={whatsapp}
                  siteUrl={env.siteUrl}
                  prioridade={i < 3}
                />
              ))}
            </div>
          )}

          {paginas > 1 && (
            <nav className="mt-10 flex justify-center gap-1">
              {Array.from({ length: paginas }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={linkDaPagina(n)}
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-lg border text-sm tabular-nums transition-colors",
                    n === pagina
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {n}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </main>
  );
}
