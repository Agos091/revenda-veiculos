"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { redefinirSenha, type ResultadoAcao } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Botao() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Salvando…" : "Salvar nova senha"}
    </Button>
  );
}

export function FormularioNovaSenha() {
  const [estado, acao] = useActionState<ResultadoAcao | null, FormData>(
    redefinirSenha,
    null,
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={acao} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="senha">Nova senha</Label>
            <Input
              id="senha"
              name="senha"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
            <p className="text-xs text-muted-foreground">Mínimo de 8 caracteres.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmacao">Repita a nova senha</Label>
            <Input
              id="confirmacao"
              name="confirmacao"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          {estado?.erro && (
            <p role="alert" className="text-sm text-destructive">
              {estado.erro}
            </p>
          )}

          <Botao />
        </form>
      </CardContent>
    </Card>
  );
}
