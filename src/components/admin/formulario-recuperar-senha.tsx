"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { enviarRecuperacao, type ResultadoAcao } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Botao() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Enviando…" : "Enviar link de recuperação"}
    </Button>
  );
}

export function FormularioRecuperarSenha() {
  const [estado, acao] = useActionState<ResultadoAcao | null, FormData>(
    enviarRecuperacao,
    null,
  );

  return (
    <Card>
      <CardContent className="pt-6">
        {estado?.ok ? (
          <div className="space-y-4 text-center">
            <p className="text-sm">
              Se existir uma conta com esse email, o link de recuperação acabou de ser
              enviado. Ele vale por 1 hora.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/login">Voltar para o login</Link>
            </Button>
          </div>
        ) : (
          <form action={acao} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email da conta</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>

            {estado?.erro && (
              <p role="alert" className="text-sm text-destructive">
                {estado.erro}
              </p>
            )}

            <Botao />

            <Link
              href="/admin/login"
              className="block text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Voltar para o login
            </Link>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
