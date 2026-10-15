"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  alternarDestaque,
  atualizarStatus,
  excluirVeiculo,
} from "@/lib/veiculos/actions";
import { STATUS } from "@/lib/veiculos/constantes";
import type { StatusVeiculo } from "@/types/database";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function SelectStatus({
  id,
  status,
}: {
  id: string;
  status: StatusVeiculo;
}) {
  const [valor, setValor] = useState(status);
  const [pendente, startTransition] = useTransition();

  return (
    <Select
      value={valor}
      disabled={pendente}
      onValueChange={(novo) => {
        const anterior = valor;
        setValor(novo as StatusVeiculo);
        startTransition(async () => {
          const r = await atualizarStatus(id, novo as StatusVeiculo);
          if (!r.ok) {
            setValor(anterior);
            toast.error(r.erro ?? "Não foi possível mudar o status.");
          } else {
            toast.success("Status atualizado.");
          }
        });
      }}
    >
      <SelectTrigger size="sm" className="w-[9.5rem]">
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
  );
}

export function ToggleDestaque({
  id,
  destaque,
}: {
  id: string;
  destaque: boolean;
}) {
  const [ativo, setAtivo] = useState(destaque);
  const [pendente, startTransition] = useTransition();

  return (
    <Switch
      checked={ativo}
      disabled={pendente}
      aria-label="Destacar veículo"
      onCheckedChange={(novo) => {
        setAtivo(novo);
        startTransition(async () => {
          const r = await alternarDestaque(id, novo);
          if (!r.ok) {
            setAtivo(!novo);
            toast.error(r.erro ?? "Não foi possível mudar o destaque.");
          }
        });
      }}
    />
  );
}

export function BotaoExcluir({ id, nome }: { id: string; nome: string }) {
  const router = useRouter();
  const [pendente, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Excluir ${nome}`}>
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir {nome}?</AlertDialogTitle>
          <AlertDialogDescription>
            O veículo e todas as fotos são apagados. Não dá para desfazer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={pendente}
            onClick={(e) => {
              e.preventDefault();
              startTransition(async () => {
                const r = await excluirVeiculo(id);
                if (r.ok) {
                  toast.success(`${nome} excluído.`);
                  router.refresh();
                } else {
                  toast.error(r.erro ?? "Não foi possível excluir.");
                }
              });
            }}
          >
            {pendente ? "Excluindo…" : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
