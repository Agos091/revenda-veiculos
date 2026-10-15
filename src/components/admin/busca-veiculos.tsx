"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

/** Busca por marca, modelo ou versão — escreve na URL depois de 400ms parado. */
export function BuscaVeiculos() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [termo, setTermo] = useState(searchParams.get("busca") ?? "");

  useEffect(() => {
    const atual = searchParams.get("busca") ?? "";
    if (termo === atual) return;

    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (termo.trim()) params.set("busca", termo.trim());
      else params.delete("busca");

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    }, 400);

    return () => clearTimeout(t);
  }, [termo, searchParams, pathname, router]);

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        placeholder="Buscar por marca, modelo…"
        className="pl-9"
        aria-label="Buscar veículos"
      />
    </div>
  );
}
