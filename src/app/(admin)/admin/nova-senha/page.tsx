import type { Metadata } from "next";
import { FormularioNovaSenha } from "@/components/admin/formulario-nova-senha";

export const metadata: Metadata = { title: "Nova senha — Revenda de Veículos" };

export default function NovaSenhaPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <p className="font-heading text-2xl font-bold tracking-tight">
            Revenda<span className="text-primary">.</span>
          </p>
          <p className="text-sm text-muted-foreground">Escolha a nova senha</p>
        </div>
        <FormularioNovaSenha />
      </div>
    </main>
  );
}
