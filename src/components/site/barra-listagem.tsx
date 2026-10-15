"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { FiltrosVeiculos } from "@/components/site/filtros-veiculos";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ORDENS = [
  { valor: "recentes", label: "Mais recentes" },
  { valor: "menor-preco", label: "Menor preço" },
  { valor: "maior-preco", label: "Maior preço" },
  { valor: "mais-novo", label: "Mais novo" },
  { valor: "menor-km", label: "Menor km" },
];

export function OrdenarSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const atual = searchParams.get("ordenar") ?? "recentes";

  return (
    <Select
      value={atual}
      onValueChange={(valor) => {
        const params = new URLSearchParams(searchParams.toString());
        if (valor === "recentes") params.delete("ordenar");
        else params.set("ordenar", valor);
        params.delete("pagina");
        const query = params.toString();
        router.push(query ? `/veiculos?${query}` : "/veiculos");
      }}
    >
      <SelectTrigger className="w-[11rem]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ORDENS.map((o) => (
          <SelectItem key={o.valor} value={o.valor}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Botão "Filtrar" do mobile: abre os mesmos filtros num bottom sheet. */
export function FiltrosMobile({ marcas }: { marcas: string[] }) {
  const [aberto, setAberto] = useState(false);

  return (
    <Sheet open={aberto} onOpenChange={setAberto}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <SlidersHorizontal className="size-4" />
          Filtrar
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-8">
          <FiltrosVeiculos marcas={marcas} aoAplicar={() => setAberto(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
