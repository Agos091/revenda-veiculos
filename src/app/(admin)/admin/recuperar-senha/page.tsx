import type { Metadata } from "next";
import { FormularioRecuperarSenha } from "@/components/admin/formulario-recuperar-senha";

export const metadata: Metadata = { title: "Recuperar senha — Revenda de Veículos" };

export default function RecuperarSenhaPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <p className="font-heading text-2xl font-bold tracking-tight">
            Revenda<span className="text-primary">.</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Informe o email da conta e mandamos um link para criar uma senha nova.
          </p>
        </div>
        <FormularioRecuperarSenha />
      </div>
    </main>
  );
}
