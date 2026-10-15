"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { entrar, type ResultadoAcao } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function BotaoEntrar() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Entrando…" : "Entrar"}
    </Button>
  );
}

export function FormularioLogin({ destino }: { destino?: string }) {
  const [estado, acao] = useActionState<ResultadoAcao | null, FormData>(entrar, null);

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={acao} className="space-y-4">
          <input type="hidden" name="next" value={destino ?? "/admin"} />

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="vendedor@minharevenda.com.br"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          {estado?.erro && (
            <p role="alert" className="text-sm text-destructive">
              {estado.erro}
            </p>
          )}

          <BotaoEntrar />
        </form>
      </CardContent>
    </Card>
  );
}
