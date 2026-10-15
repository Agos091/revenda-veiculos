"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import type { VeiculoFoto } from "@/types/database";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function GaleriaVeiculo({
  fotos,
  titulo,
  vendido,
}: {
  fotos: VeiculoFoto[];
  titulo: string;
  vendido?: boolean;
}) {
  const [indice, setIndice] = useState(0);
  const [cheia, setCheia] = useState(false);

  if (fotos.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl border bg-card text-sm text-muted-foreground">
        Sem fotos
      </div>
    );
  }

  const atual = fotos[Math.min(indice, fotos.length - 1)];
  const anterior = () => setIndice((i) => (i - 1 + fotos.length) % fotos.length);
  const proxima = () => setIndice((i) => (i + 1) % fotos.length);

  return (
    <div className="space-y-3">
      <div className="relative aspect-video overflow-hidden rounded-xl border bg-card">
        <Image
          src={atual.url}
          alt={`${titulo} — foto ${indice + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className={cn("object-cover", vendido && "opacity-50")}
        />

        {vendido && (
          <span className="absolute inset-0 flex items-center justify-center font-heading text-4xl font-extrabold tracking-widest text-primary">
            VENDIDO
          </span>
        )}

        {fotos.length > 1 && (
          <>
            <button
              type="button"
              onClick={anterior}
              aria-label="Foto anterior"
              className="absolute top-1/2 left-3 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-background/70 backdrop-blur transition-colors hover:bg-background"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={proxima}
              aria-label="Próxima foto"
              className="absolute top-1/2 right-3 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-background/70 backdrop-blur transition-colors hover:bg-background"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}

        <span className="absolute bottom-3 left-3 rounded-md bg-background/70 px-2 py-1 text-xs backdrop-blur tabular-nums">
          {indice + 1}/{fotos.length}
        </span>

        <button
          type="button"
          onClick={() => setCheia(true)}
          aria-label="Ver em tela cheia"
          className="absolute right-3 bottom-3 grid size-8 place-items-center rounded-md bg-background/70 backdrop-blur transition-colors hover:bg-background"
        >
          <Expand className="size-4" />
        </button>
      </div>

      {fotos.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1">
          {fotos.map((foto, i) => (
            <li key={foto.id}>
              <button
                type="button"
                onClick={() => setIndice(i)}
                aria-label={`Ver foto ${i + 1}`}
                className={cn(
                  "relative block aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg border transition-colors",
                  i === indice ? "border-primary" : "border-border opacity-70 hover:opacity-100",
                )}
              >
                <Image
                  src={foto.url}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={cheia} onOpenChange={setCheia}>
        <DialogContent className="max-w-5xl border-0 bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{titulo}</DialogTitle>
          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            <Image
              src={atual.url}
              alt={`${titulo} — foto ${indice + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
