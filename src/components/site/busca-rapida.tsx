"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FAIXAS = [
  { valor: "0-40000", label: "Até R$ 40.000" },
  { valor: "40000-70000", label: "R$ 40 a 70 mil" },
  { valor: "70000-110000", label: "R$ 70 a 110 mil" },
  { valor: "110000-", label: "Acima de R$ 110.000" },
];

/** Busca do hero: marca + faixa de preço, manda para /veiculos com os filtros. */
export function BuscaRapida({ marcas }: { marcas: string[] }) {
  const router = useRouter();
  const [marca, setMarca] = useState("");
  const [faixa, setFaixa] = useState("");

  function buscar() {
    const params = new URLSearchParams();
    if (marca) params.set("marca", marca);
    if (faixa) {
      const [min, max] = faixa.split("-");
      if (min) params.set("precoMin", min);
      if (max) params.set("precoMax", max);
    }
    const query = params.toString();
    router.push(query ? `/veiculos?${query}` : "/veiculos");
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-card/80 p-2 backdrop-blur sm:flex-row">
      <Select value={marca} onValueChange={setMarca}>
        <SelectTrigger className="w-full border-0 bg-transparent sm:w-48">
          <SelectValue placeholder="Marca" />
        </SelectTrigger>
        <SelectContent>
          {marcas.length === 0 ? (
            <SelectItem value="-" disabled>
              Sem veículos no estoque
            </SelectItem>
          ) : (
            marcas.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <Select value={faixa} onValueChange={setFaixa}>
        <SelectTrigger className="w-full border-0 bg-transparent sm:w-56">
          <SelectValue placeholder="Faixa de preço" />
        </SelectTrigger>
        <SelectContent>
          {FAIXAS.map((f) => (
            <SelectItem key={f.valor} value={f.valor}>
              {f.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button size="lg" className="shrink-0 sm:ml-auto" onClick={buscar}>
        <Search className="size-4" />
        Ver estoque
      </Button>
    </div>
  );
}
