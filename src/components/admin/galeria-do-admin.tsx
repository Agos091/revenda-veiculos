"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { ImagePlus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { definirCapa, registrarFoto, removerFoto, reordenarFotos } from "@/lib/veiculos/actions";
import { LIMITE_DE_FOTOS } from "@/lib/veiculos/constantes";
import type { VeiculoFoto } from "@/types/database";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COMPRESSAO = {
  maxSizeMB: 0.3,
  maxWidthOrHeight: 1600,
  useWebWorker: true,
  fileType: "image/jpeg",
};

export function GaleriaDoAdmin({
  veiculoId,
  fotos,
}: {
  veiculoId: string;
  fotos: VeiculoFoto[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [arrastando, setArrastando] = useState(false);
  const [ordem, setOrdem] = useState<VeiculoFoto[]>(fotos);
  const [, startTransition] = useTransition();

  const sincronizar = () => {
    router.refresh();
  };

  async function enviarArquivos(arquivos: FileList | File[]) {
    const lista = Array.from(arquivos).filter((f) => f.type.startsWith("image/"));
    if (lista.length === 0) return;

    const espaco = LIMITE_DE_FOTOS - ordem.length;
    if (espaco <= 0) {
      toast.error(`Limite de ${LIMITE_DE_FOTOS} fotos por veículo.`);
      return;
    }
    const aEnviar = lista.slice(0, espaco);
    if (aEnviar.length < lista.length) {
      toast.warning(`Só cabem mais ${espaco} fotos — o restante foi ignorado.`);
    }

    setEnviando(true);
    setProgresso(0);
    const supabase = createClient();

    try {
      for (const [indice, arquivo] of aEnviar.entries()) {
        const comprimido = await imageCompression(arquivo, COMPRESSAO);
        const caminho = `${veiculoId}/${crypto.randomUUID()}.jpg`;

        const { error } = await supabase.storage
          .from("veiculos")
          .upload(caminho, comprimido, { contentType: "image/jpeg", upsert: false });

        if (error) throw new Error(error.message);

        const {
          data: { publicUrl },
        } = supabase.storage.from("veiculos").getPublicUrl(caminho);

        const r = await registrarFoto(veiculoId, publicUrl);
        if (!r.ok) throw new Error(r.erro ?? "Falha ao registrar a foto.");

        setProgresso(Math.round(((indice + 1) / aEnviar.length) * 100));
      }

      toast.success(aEnviar.length === 1 ? "Foto enviada." : `${aEnviar.length} fotos enviadas.`);
      sincronizar();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível enviar as fotos.");
    } finally {
      setEnviando(false);
      setProgresso(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function moverPara(origem: number, destino: number) {
    if (origem === destino) return;
    const nova = [...ordem];
    const [item] = nova.splice(origem, 1);
    nova.splice(destino, 0, item);
    setOrdem(nova);

    startTransition(async () => {
      const r = await reordenarFotos(veiculoId, nova.map((f) => f.id));
      if (!r.ok) {
        toast.error(r.erro ?? "Não foi possível reordenar.");
        setOrdem(fotos);
      } else {
        sincronizar();
      }
    });
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setArrastando(true);
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastando(false);
          if (e.dataTransfer.files?.length) void enviarArquivos(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors",
          arrastando ? "border-primary bg-primary/5" : "border-border",
        )}
      >
        <ImagePlus className="size-8 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Arraste as fotos aqui</p>
          <p className="text-xs text-muted-foreground">
            JPG ou PNG, até {LIMITE_DE_FOTOS} fotos. São comprimidas antes do envio.
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files && void enviarArquivos(e.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          disabled={enviando}
          onClick={() => inputRef.current?.click()}
        >
          {enviando ? "Enviando…" : "Escolher fotos"}
        </Button>

        {enviando && (
          <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progresso}%` }}
            />
          </div>
        )}
      </div>

      {ordem.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          Nenhuma foto ainda. A primeira enviada vira a capa.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {ordem.map((foto, indice) => (
            <li
              key={foto.id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", String(indice))}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const origem = Number(e.dataTransfer.getData("text/plain"));
                if (!Number.isNaN(origem)) moverPara(origem, indice);
              }}
              className={cn(
                "group relative aspect-[4/3] cursor-grab overflow-hidden rounded-xl border bg-muted",
                foto.is_capa && "ring-2 ring-primary",
              )}
            >
              <Image
                src={foto.url}
                alt={`Foto ${indice + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover"
              />

              {foto.is_capa && (
                <span className="absolute top-2 left-2 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                  CAPA
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                {!foto.is_capa && (
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="secondary"
                    title="Definir como capa"
                    onClick={() =>
                      startTransition(async () => {
                        const r = await definirCapa(foto.id, veiculoId);
                        if (r.ok) sincronizar();
                        else toast.error(r.erro ?? "Não foi possível definir a capa.");
                      })
                    }
                  >
                    <Star className="size-3.5" />
                  </Button>
                )}
                <Button
                  type="button"
                  size="icon-sm"
                  variant="secondary"
                  title="Remover foto"
                  onClick={() =>
                    startTransition(async () => {
                      const r = await removerFoto(foto.id, veiculoId);
                      if (r.ok) {
                        setOrdem((atual) => atual.filter((f) => f.id !== foto.id));
                        sincronizar();
                      } else {
                        toast.error(r.erro ?? "Não foi possível remover.");
                      }
                    })
                  }
                >
                  <Trash2 className="size-3.5 text-destructive" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
