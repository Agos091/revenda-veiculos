import type { Metadata } from "next";
import { FormularioLogin } from "@/components/admin/formulario-login";

export const metadata: Metadata = { title: "Entrar — Revenda de Veículos" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <p className="font-heading text-2xl font-bold tracking-tight">
            Revenda<span className="text-primary">.</span>
          </p>
          <p className="text-sm text-muted-foreground">Área do vendedor</p>
        </div>
        <FormularioLogin destino={next} />
      </div>
    </main>
  );
}
