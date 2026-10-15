"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { salvarVeiculo } from "@/lib/veiculos/actions";
import {
  veiculoSchema,
  type VeiculoFormData,
  type VeiculoFormValues,
} from "@/lib/veiculos/schema";
import {
  CAMBIOS,
  CARROCERIAS,
  COMBUSTIVEIS,
  GRUPOS_DE_OPCIONAIS,
  STATUS,
} from "@/lib/veiculos/constantes";
import type { VeiculoComFotos } from "@/types/database";
import { Campo, CampoTexto, LinhaToggle } from "@/components/admin/campos-formulario";
import { GaleriaDoAdmin } from "@/components/admin/galeria-do-admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const ABAS = [
  { valor: "basico", label: "Dados básicos" },
  { valor: "ficha", label: "Ficha técnica" },
  { valor: "historico", label: "Histórico" },
  { valor: "opcionais", label: "Opcionais" },
  { valor: "fotos", label: "Fotos" },
  { valor: "descricao", label: "Descrição" },
];

const HISTORICO = [
  { campo: "unico_dono", label: "Único dono" },
  { campo: "ipva_pago", label: "IPVA pago" },
  { campo: "licenciado", label: "Licenciado" },
  { campo: "revisoes_concessionaria", label: "Revisões em concessionária" },
  { campo: "laudo_cautelar", label: "Laudo cautelar aprovado" },
  { campo: "garantia_fabrica", label: "Garantia de fábrica" },
] as const;

function valoresIniciais(veiculo?: VeiculoComFotos | null): VeiculoFormValues {
  const anoAtual = new Date().getFullYear();
  return {
    marca: veiculo?.marca ?? "",
    modelo: veiculo?.modelo ?? "",
    versao: veiculo?.versao ?? "",
    ano_fabricacao: veiculo?.ano_fabricacao ?? anoAtual,
    ano_modelo: veiculo?.ano_modelo ?? anoAtual,
    carroceria: veiculo?.carroceria ?? null,
    cor: veiculo?.cor ?? "",
    final_placa: veiculo?.final_placa ?? "",
    km: veiculo?.km ?? 0,
    cambio: veiculo?.cambio ?? null,
    combustivel: veiculo?.combustivel ?? null,
    motor: veiculo?.motor ?? "",
    portas: veiculo?.portas ?? "",
    preco: veiculo?.preco ?? 0,
    preco_fipe: veiculo?.preco_fipe ?? "",
    aceita_troca: veiculo?.aceita_troca ?? false,
    aceita_financiamento: veiculo?.aceita_financiamento ?? true,
    unico_dono: veiculo?.unico_dono ?? false,
    ipva_pago: veiculo?.ipva_pago ?? false,
    licenciado: veiculo?.licenciado ?? false,
    revisoes_concessionaria: veiculo?.revisoes_concessionaria ?? false,
    laudo_cautelar: veiculo?.laudo_cautelar ?? false,
    garantia_fabrica: veiculo?.garantia_fabrica ?? false,
    opcionais: veiculo?.opcionais ?? [],
    descricao: veiculo?.descricao ?? "",
    status: veiculo?.status ?? "disponivel",
    destaque: veiculo?.destaque ?? false,
  };
}

export function FormularioVeiculo({ veiculo }: { veiculo?: VeiculoComFotos | null }) {
  const router = useRouter();
  const [aba, setAba] = useState("basico");
  const [salvando, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<VeiculoFormValues, unknown, VeiculoFormData>({
    resolver: zodResolver(veiculoSchema),
    defaultValues: valoresIniciais(veiculo),
  });

  const descricao = watch("descricao") ?? "";

  const onSubmit = (valores: VeiculoFormData) => {
    startTransition(async () => {
      const r = await salvarVeiculo(veiculo?.id ?? null, valores);
      if (!r.ok) {
        toast.error(r.erro ?? "Não foi possível salvar.");
        return;
      }
      toast.success(veiculo ? "Veículo atualizado." : "Veículo cadastrado.");
      if (!veiculo && r.id) router.push(`/admin/veiculos/${r.id}`);
      else router.refresh();
    });
  };

  const onErro = () => {
    toast.error("Faltam campos obrigatórios em Dados básicos ou Ficha técnica.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onErro)} className="pb-24">
      <Tabs value={aba} onValueChange={setAba}>
        <TabsList className="mb-6 flex w-full flex-wrap justify-start">
          {ABAS.map((a) => (
            <TabsTrigger key={a.valor} value={a.valor}>
              {a.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ------------------------------ básico ------------------------------ */}
        <TabsContent value="basico">
          <Card>
            <CardContent className="grid gap-5 pt-6 sm:grid-cols-2 lg:grid-cols-3">
              <CampoTexto
                id="marca"
                label="Marca"
                obrigatorio
                erro={errors.marca?.message}
                placeholder="Honda"
                {...register("marca")}
              />
              <CampoTexto
                id="modelo"
                label="Modelo"
                obrigatorio
                erro={errors.modelo?.message}
                placeholder="Civic"
                {...register("modelo")}
              />
              <CampoTexto
                id="versao"
                label="Versão"
                erro={errors.versao?.message}
                placeholder="EXL 2.0 CVT"
                {...register("versao")}
              />
              <CampoTexto
                id="ano_fabricacao"
                label="Ano de fabricação"
                obrigatorio
                type="number"
                erro={errors.ano_fabricacao?.message}
                {...register("ano_fabricacao")}
              />
              <CampoTexto
                id="ano_modelo"
                label="Ano do modelo"
                obrigatorio
                type="number"
                erro={errors.ano_modelo?.message}
                {...register("ano_modelo")}
              />
              <Campo id="carroceria" label="Carroceria" erro={errors.carroceria?.message}>
                <Controller
                  control={control}
                  name="carroceria"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(v) => field.onChange(v || null)}
                    >
                      <SelectTrigger id="carroceria" className="w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {CARROCERIAS.map((c) => (
                          <SelectItem key={c.valor} value={c.valor}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Campo>
              <CampoTexto
                id="cor"
                label="Cor"
                erro={errors.cor?.message}
                placeholder="Prata"
                {...register("cor")}
              />
              <CampoTexto
                id="final_placa"
                label="Final da placa"
                type="number"
                min={0}
                max={9}
                erro={errors.final_placa?.message}
                {...register("final_placa")}
              />
              <CampoTexto
                id="preco"
                label="Preço (R$)"
                obrigatorio
                type="number"
                step="100"
                erro={errors.preco?.message}
                {...register("preco")}
              />
              <CampoTexto
                id="preco_fipe"
                label="Valor FIPE (R$)"
                type="number"
                step="100"
                erro={errors.preco_fipe?.message}
                {...register("preco_fipe")}
              />
              <Campo id="status" label="Status" erro={errors.status?.message}>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="status" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS.map((s) => (
                          <SelectItem key={s.valor} value={s.valor}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Campo>

              <div className="space-y-3 sm:col-span-2 lg:col-span-3">
                <Controller
                  control={control}
                  name="aceita_troca"
                  render={({ field }) => (
                    <LinhaToggle label="Aceita troca">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </LinhaToggle>
                  )}
                />
                <Controller
                  control={control}
                  name="aceita_financiamento"
                  render={({ field }) => (
                    <LinhaToggle label="Aceita financiamento">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </LinhaToggle>
                  )}
                />
                <Controller
                  control={control}
                  name="destaque"
                  render={({ field }) => (
                    <LinhaToggle
                      label="Destaque"
                      descricao="Aparece na home e ganha a linha vermelha no card."
                    >
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </LinhaToggle>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------- ficha ------------------------------ */}
        <TabsContent value="ficha">
          <Card>
            <CardContent className="grid gap-5 pt-6 sm:grid-cols-2 lg:grid-cols-3">
              <CampoTexto
                id="km"
                label="Quilometragem"
                obrigatorio
                type="number"
                erro={errors.km?.message}
                {...register("km")}
              />
              <Campo id="cambio" label="Câmbio" erro={errors.cambio?.message}>
                <Controller
                  control={control}
                  name="cambio"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(v) => field.onChange(v || null)}
                    >
                      <SelectTrigger id="cambio" className="w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {CAMBIOS.map((c) => (
                          <SelectItem key={c.valor} value={c.valor}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Campo>
              <Campo id="combustivel" label="Combustível" erro={errors.combustivel?.message}>
                <Controller
                  control={control}
                  name="combustivel"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(v) => field.onChange(v || null)}
                    >
                      <SelectTrigger id="combustivel" className="w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMBUSTIVEIS.map((c) => (
                          <SelectItem key={c.valor} value={c.valor}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Campo>
              <CampoTexto
                id="motor"
                label="Motor"
                erro={errors.motor?.message}
                placeholder="1.0 turbo"
                {...register("motor")}
              />
              <CampoTexto
                id="portas"
                label="Portas"
                type="number"
                min={1}
                max={6}
                erro={errors.portas?.message}
                {...register("portas")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ----------------------------- histórico ---------------------------- */}
        <TabsContent value="historico">
          <Card>
            <CardContent className="grid gap-3 pt-6 sm:grid-cols-2">
              {HISTORICO.map(({ campo, label }) => (
                <Controller
                  key={campo}
                  control={control}
                  name={campo}
                  render={({ field }) => (
                    <LinhaToggle label={label}>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </LinhaToggle>
                  )}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ----------------------------- opcionais ---------------------------- */}
        <TabsContent value="opcionais">
          <Controller
            control={control}
            name="opcionais"
            render={({ field }) => (
              <div className="grid gap-4 md:grid-cols-2">
                {GRUPOS_DE_OPCIONAIS.map(({ grupo, itens }) => (
                  <Card key={grupo}>
                    <CardContent className="space-y-3 pt-6">
                      <p className="font-heading text-sm font-bold">{grupo}</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {itens.map((item) => {
                          const marcado = field.value.includes(item);
                          const id = `opcional-${item}`;
                          return (
                            <div key={item} className="flex items-center gap-2">
                              <Checkbox
                                id={id}
                                checked={marcado}
                                onCheckedChange={(v) =>
                                  field.onChange(
                                    v
                                      ? [...field.value, item]
                                      : field.value.filter((o: string) => o !== item),
                                  )
                                }
                              />
                              <Label htmlFor={id} className="text-sm font-normal">
                                {item}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          />
        </TabsContent>

        {/* ------------------------------- fotos ------------------------------ */}
        <TabsContent value="fotos">
          <Card>
            <CardContent className="pt-6">
              {veiculo ? (
                <GaleriaDoAdmin veiculoId={veiculo.id} fotos={veiculo.fotos ?? []} />
              ) : (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Salve o veículo primeiro — aí as fotos podem ser enviadas.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ----------------------------- descrição ---------------------------- */}
        <TabsContent value="descricao">
          <Card>
            <CardContent className="space-y-2 pt-6">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                rows={8}
                placeholder="Conte o que o comprador precisa saber: estado de conservação, revisões, pneus…"
                {...register("descricao")}
              />
              <p className="text-right text-xs text-muted-foreground tabular-nums">
                {String(descricao).length} caracteres
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            {Object.keys(errors).length > 0
              ? "Há campos com erro — confira as abas marcadas."
              : isDirty
                ? "Alterações não salvas"
                : "Tudo salvo"}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/veiculos")}
            >
              Cancelar
            </Button>
            <Button type="submit" size="lg" disabled={salvando}>
              {salvando ? "Salvando…" : veiculo ? "Salvar alterações" : "Salvar e publicar"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
