"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { CAMBIOS, CARROCERIAS, COMBUSTIVEIS } from "@/lib/veiculos/constantes";
import { formatarKm, formatarPreco } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Atalhos que cobrem a maioria das buscas sem abrir o painel de filtros. */
const ATALHOS: { label: string; params: Record<string, string> }[] = [
  { label: "Até R$ 50 mil", params: { precoMax: "50000" } },
  { label: "R$ 50 a 100 mil", params: { precoMin: "50000", precoMax: "100000" } },
  { label: "Acima de R$ 100 mil", params: { precoMin: "100000" } },
  { label: "SUV", params: { carroceria: "suv" } },
  { label: "Hatch", params: { carroceria: "hatch" } },
  { label: "Sedã", params: { carroceria: "sedan" } },
  { label: "Automático", params: { cambio: "automatico" } },
];

function rotuloDoFiltro(chave: string, valor: string): string | null {
  switch (chave) {
    case "busca":
      return `"${valor}"`;
    case "marca":
      return valor;
    case "precoMin":
      return `A partir de ${formatarPreco(Number(valor))}`;
    case "precoMax":
      return `Até ${formatarPreco(Number(valor))}`;
    case "anoMin":
      return `De ${valor}`;
    case "anoMax":
      return `Até ${valor}`;
    case "kmMax":
      return `Até ${formatarKm(Number(valor))}`;
    case "cambio":
      return CAMBIOS.find((c) => c.valor === valor)?.label ?? valor;
    case "combustivel":
      return COMBUSTIVEIS.find((c) => c.valor === valor)?.label ?? valor;
    case "carroceria":
      return CARROCERIAS.find((c) => c.valor === valor)?.label ?? valor;
    case "troca":
      return "Aceita troca";
    case "financiamento":
      return "Aceita financiamento";
    default:
      return null;
  }
}

function useNavegacaoDeFiltros() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function ir(params: URLSearchParams) {
    params.delete("pagina");
    const query = params.toString();
    router.push(query ? `/veiculos?${query}` : "/veiculos");
  }

  return { router, searchParams, ir };
}

/** Campo de busca por texto — o caminho mais curto para quem já sabe o modelo. */
export function BuscaEstoque({ className }: { className?: string }) {
  const { searchParams, ir } = useNavegacaoDeFiltros();
  const [termo, setTermo] = useState(searchParams.get("busca") ?? "");

  useEffect(() => {
    setTermo(searchParams.get("busca") ?? "");
  }, [searchParams]);

  function buscar(valor: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (valor.trim()) params.set("busca", valor.trim());
    else params.delete("busca");
    ir(params);
  }

  return (
    <form
      className={cn("relative", className)}
      onSubmit={(e) => {
        e.preventDefault();
        buscar(termo);
      }}
    >
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        placeholder="Buscar por marca ou modelo — ex.: Civic"
        aria-label="Buscar veículo"
        className="h-11 pr-10 pl-9"
      />
      {termo && (
        <button
          type="button"
          onClick={() => {
            setTermo("");
            buscar("");
          }}
          aria-label="Limpar busca"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </form>
  );
}

/** Atalhos de um clique: faixa de preço, carroceria e câmbio. */
export function AtalhosDeFiltro() {
  const { searchParams, ir } = useNavegacaoDeFiltros();

  const ativo = (params: Record<string, string>) =>
    Object.entries(params).every(([k, v]) => searchParams.get(k) === v);

  return (
    <div className="flex flex-nowrap gap-2 sm:flex-wrap">
      {ATALHOS.map((atalho) => {
        const estaAtivo = ativo(atalho.params);
        return (
          <button
            key={atalho.label}
            type="button"
            aria-pressed={estaAtivo}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              for (const chave of Object.keys(atalho.params)) params.delete(chave);
              if (!estaAtivo) {
                for (const [chave, valor] of Object.entries(atalho.params)) {
                  params.set(chave, valor);
                }
              }
              ir(params);
            }}
            className={cn(
              "inline-flex h-9 items-center rounded-full border px-4 text-sm whitespace-nowrap transition-colors",
              estaAtivo
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
            )}
          >
            {atalho.label}
          </button>
        );
      })}
    </div>
  );
}

/** O que está filtrado agora, com X para tirar cada um. */
export function ChipsAtivos() {
  const { searchParams, ir } = useNavegacaoDeFiltros();

  const ativos = [...searchParams.entries()]
    .filter(([chave]) => chave !== "ordenar" && chave !== "pagina")
    .map(([chave, valor]) => ({ chave, valor, label: rotuloDoFiltro(chave, valor) }))
    .filter((f) => f.label);

  if (ativos.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {ativos.map(({ chave, label }) => (
        <button
          key={chave}
          type="button"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete(chave);
            ir(params);
          }}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-primary px-3 text-sm text-primary transition-colors hover:bg-primary/10"
        >
          {label}
          <X className="size-3.5" />
        </button>
      ))}
      <button
        type="button"
        onClick={() => ir(new URLSearchParams())}
        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        Limpar tudo
      </button>
    </div>
  );
}
