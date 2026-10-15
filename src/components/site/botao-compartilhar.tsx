"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/** Usa o compartilhamento nativo no celular; no desktop copia o link. */
export function BotaoCompartilhar({
  titulo,
  url,
  children,
}: {
  titulo: string;
  url: string;
  children: React.ReactNode;
}) {
  async function compartilhar() {
    try {
      if (navigator.share) {
        await navigator.share({ title: titulo, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado.");
    } catch {
      // o visitante cancelou o compartilhamento
    }
  }

  return (
    <Button variant="outline" size="lg" className="w-full" onClick={compartilhar}>
      {children}
    </Button>
  );
}
