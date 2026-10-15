"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CAMBIOS, CARROCERIAS, COMBUSTIVEIS } from "@/lib/veiculos/constantes";
import { formatarPreco } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const PRECO_MAXIMO = 300_000;

interface Props {
  marcas: string[];
  aoAplicar?: () => void;
}

/** Painel de filtros — na sidebar do desktop e dentro do bottom sheet no mobile. */
export function FiltrosVeiculos({ marcas, aoAplicar }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const atual = useMemo(
    () => ({
      marca: searchParams.get("marca") ?? "",
      precoMin: Number(searchParams.get("precoMin") ?? 0),
      precoMax: Number(searchParams.get("precoMax") ?? PRECO_MAXIMO),
      anoMin: searchParams.get("anoMin") ?? "",
      anoMax: searchParams.get("anoMax") ?? "",
      kmMax: searchParams.get("kmMax") ?? "",
      cambio: searchParams.get("cambio") ?? "",
      combustivel: searchParams.get("combustivel") ?? "",
      carroceria: searchParams.get("carroceria") ?? "",
      troca: searchParams.get("troca") === "1",
      financiamento: searchParams.get("financiamento") === "1",
    }),
    [searchParams],
  );

  const [estado, setEstado] = useState(atual);
  const atualizar = <C extends keyof typeof estado>(campo: C, valor: (typeof estado)[C]) =>
    setEstado((e) => ({ ...e, [campo]: valor }));

  function aplicar() {
    const params = new URLSearchParams();
    const ordenar = searchParams.get("ordenar");
    if (ordenar) params.set("ordenar", ordenar);

    if (estado.marca) params.set("marca", estado.marca);
    if (estado.precoMin > 0) params.set("precoMin", String(estado.precoMin));
    if (estado.precoMax < PRECO_MAXIMO) params.set("precoMax", String(estado.precoMax));
    if (estado.anoMin) params.set("anoMin", estado.anoMin);
    if (estado.anoMax) params.set("anoMax", estado.anoMax);
    if (estado.kmMax) params.set("kmMax", estado.kmMax);
    if (estado.cambio) params.set("cambio", estado.cambio);
    if (estado.combustivel) params.set("combustivel", estado.combustivel);
    if (estado.carroceria) params.set("carroceria", estado.carroceria);
    if (estado.troca) params.set("troca", "1");
    if (estado.financiamento) params.set("financiamento", "1");

    const query = params.toString();
    router.push(query ? `/veiculos?${query}` : "/veiculos");
    aoAplicar?.();
  }

  function limpar() {
    router.push("/veiculos");
    aoAplicar?.();
  }

  return (
    <div className="space-y-6">
      <Grupo titulo="Marca">
        <div className="flex flex-wrap gap-2">
          {marcas.map((m) => (
            <Chip
              key={m}
              ativo={estado.marca === m}
              onClick={() => atualizar("marca", estado.marca === m ? "" : m)}
            >
              {m}
            </Chip>
          ))}
          {marcas.length === 0 && (
            <p className="text-xs text-muted-foreground">Nenhuma marca no estoque.</p>
          )}
        </div>
      </Grupo>

      <Grupo titulo="Preço">
        <Slider
          value={[estado.precoMin, estado.precoMax]}
          min={0}
          max={PRECO_MAXIMO}
          step={5000}
          onValueChange={([min, max]) =>
            setEstado((e) => ({ ...e, precoMin: min, precoMax: max }))
          }
        />
        <p className="mt-2 text-xs text-muted-foreground tabular-nums">
          {formatarPreco(estado.precoMin)} — {formatarPreco(estado.precoMax)}
          {estado.precoMax >= PRECO_MAXIMO && "+"}
        </p>
      </Grupo>

      <Grupo titulo="Ano">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="De"
            value={estado.anoMin}
            onChange={(e) => atualizar("anoMin", e.target.value)}
          />
          <span className="text-muted-foreground">—</span>
          <Input
            type="number"
            placeholder="Até"
            value={estado.anoMax}
            onChange={(e) => atualizar("anoMax", e.target.value)}
          />
        </div>
      </Grupo>

      <Grupo titulo="Quilometragem máxima">
        <Input
          type="number"
          placeholder="Ex.: 80000"
          value={estado.kmMax}
          onChange={(e) => atualizar("kmMax", e.target.value)}
        />
      </Grupo>

      <Grupo titulo="Câmbio">
        <div className="flex flex-wrap gap-2">
          {CAMBIOS.map((c) => (
            <Chip
              key={c.valor}
              ativo={estado.cambio === c.valor}
              onClick={() => atualizar("cambio", estado.cambio === c.valor ? "" : c.valor)}
            >
              {c.label}
            </Chip>
          ))}
        </div>
      </Grupo>

      <Grupo titulo="Combustível">
        <div className="flex flex-wrap gap-2">
          {COMBUSTIVEIS.map((c) => (
            <Chip
              key={c.valor}
              ativo={estado.combustivel === c.valor}
              onClick={() =>
                atualizar("combustivel", estado.combustivel === c.valor ? "" : c.valor)
              }
            >
              {c.label}
            </Chip>
          ))}
        </div>
      </Grupo>

      <Grupo titulo="Carroceria">
        <div className="flex flex-wrap gap-2">
          {CARROCERIAS.map((c) => (
            <Chip
              key={c.valor}
              ativo={estado.carroceria === c.valor}
              onClick={() =>
                atualizar("carroceria", estado.carroceria === c.valor ? "" : c.valor)
              }
            >
              {c.label}
            </Chip>
          ))}
        </div>
      </Grupo>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="filtro-troca" className="font-normal">
            Aceita troca
          </Label>
          <Switch
            id="filtro-troca"
            checked={estado.troca}
            onCheckedChange={(v) => atualizar("troca", v)}
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="filtro-financiamento" className="font-normal">
            Aceita financiamento
          </Label>
          <Switch
            id="filtro-financiamento"
            checked={estado.financiamento}
            onCheckedChange={(v) => atualizar("financiamento", v)}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button className="flex-1" onClick={aplicar}>
          Aplicar filtros
        </Button>
        <Button variant="outline" onClick={limpar}>
          Limpar
        </Button>
      </div>
    </div>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {titulo}
      </p>
      {children}
    </div>
  );
}

function Chip({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={cn(
        "inline-flex h-8 items-center rounded-full border px-3 text-sm transition-colors",
        ativo
          ? "border-primary text-primary"
          : "border-border text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
