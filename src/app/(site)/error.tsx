"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErroDoSite({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-5 px-4 text-center">
      <h1 className="font-heading text-2xl font-bold">Algo deu errado por aqui</h1>
      <p className="text-muted-foreground">
        Tente de novo em instantes. Se continuar, fale com a gente no WhatsApp.
      </p>
      <div className="flex gap-2">
        <Button onClick={reset}>Tentar de novo</Button>
        <Button asChild variant="outline">
          <Link href="/">Voltar para a home</Link>
        </Button>
      </div>
    </main>
  );
}
