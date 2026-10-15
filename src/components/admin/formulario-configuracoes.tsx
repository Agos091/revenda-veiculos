"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { salvarConfiguracoes } from "@/lib/veiculos/actions";
import { configuracoesSchema, type ConfiguracoesFormValues } from "@/lib/veiculos/schema";
import type { Configuracoes } from "@/types/database";
import { CampoTexto } from "@/components/admin/campos-formulario";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function FormularioConfiguracoes({
  configuracoes,
}: {
  configuracoes: Configuracoes | null;
}) {
  const [salvando, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfiguracoesFormValues>({
    resolver: zodResolver(configuracoesSchema),
    defaultValues: {
      nome_loja: configuracoes?.nome_loja ?? "",
      whatsapp: configuracoes?.whatsapp ?? "",
      endereco: configuracoes?.endereco ?? "",
      cidade: configuracoes?.cidade ?? "",
      horario: configuracoes?.horario ?? "",
      instagram: configuracoes?.instagram ?? "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((valores) =>
        startTransition(async () => {
          const r = await salvarConfiguracoes(valores);
          if (r.ok) toast.success("Configurações salvas.");
          else toast.error(r.erro ?? "Não foi possível salvar.");
        }),
      )}
    >
      <Card>
        <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
          <CampoTexto
            id="nome_loja"
            label="Nome da loja"
            obrigatorio
            erro={errors.nome_loja?.message}
            {...register("nome_loja")}
          />
          <CampoTexto
            id="whatsapp"
            label="WhatsApp"
            obrigatorio
            placeholder="+55 11 99999-9999"
            erro={errors.whatsapp?.message}
            {...register("whatsapp")}
          />
          <CampoTexto
            id="endereco"
            label="Endereço"
            erro={errors.endereco?.message}
            {...register("endereco")}
          />
          <CampoTexto
            id="cidade"
            label="Cidade/UF"
            placeholder="São Paulo/SP"
            erro={errors.cidade?.message}
            {...register("cidade")}
          />
          <CampoTexto
            id="horario"
            label="Horário de atendimento"
            placeholder="Seg a Sex 9h–18h · Sáb 9h–13h"
            erro={errors.horario?.message}
            {...register("horario")}
          />
          <CampoTexto
            id="instagram"
            label="Instagram"
            placeholder="minharevenda"
            erro={errors.instagram?.message}
            {...register("instagram")}
          />

          <div className="sm:col-span-2">
            <Button type="submit" size="lg" disabled={salvando}>
              {salvando ? "Salvando…" : "Salvar configurações"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
