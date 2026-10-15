import Image from "next/image";
import Link from "next/link";
import { Calendar, Fuel, Gauge, Settings2 } from "lucide-react";
import { formatarAno, formatarKm, formatarPreco, rotulo, tituloVeiculo } from "@/lib/format";
import type { VeiculoComFotos } from "@/types/database";
import { BotaoWhatsapp } from "@/components/site/botao-whatsapp";
import { cn } from "@/lib/utils";

function capa(veiculo: VeiculoComFotos) {
  const fotos = veiculo.fotos ?? [];
  return fotos.find((f) => f.is_capa) ?? fotos[0] ?? null;
}

export function CardVeiculo({
  veiculo,
  whatsapp,
  siteUrl,
  prioridade,
}: {
  veiculo: VeiculoComFotos;
  /** Quando informado, o card ganha o botão de WhatsApp — um toque até o vendedor. */
  whatsapp?: string;
  siteUrl?: string;
  prioridade?: boolean;
}) {
  const foto = capa(veiculo);
  const nome = tituloVeiculo(veiculo);
  const vendido = veiculo.status === "vendido";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/40">
      {veiculo.destaque && !vendido && (
        <span className="absolute inset-x-0 top-0 z-10 h-[3px] bg-primary" />
      )}

      <Link href={`/veiculos/${veiculo.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-elevated">
          {foto ? (
            <Image
              src={foto.url}
              alt={nome}
              fill
              priority={prioridade}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={cn(
                "object-cover transition-transform duration-500 group-hover:scale-105",
                vendido && "opacity-40",
              )}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Sem foto
            </div>
          )}

          {vendido && (
            <span className="absolute inset-0 flex items-center justify-center font-heading text-2xl font-extrabold tracking-widest text-primary">
              VENDIDO
            </span>
          )}

          {veiculo.status === "reservado" && (
            <span className="absolute top-3 left-3 rounded-md bg-background/85 px-2 py-1 text-xs font-semibold backdrop-blur">
              Reservado
            </span>
          )}

          {veiculo.destaque && !vendido && (
            <span className="absolute top-3 right-3 rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
              Destaque
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <h3 className="font-heading leading-tight font-bold">{nome}</h3>

          <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground tabular-nums">
            <li className="inline-flex items-center gap-1">
              <Calendar className="size-3.5" />
              {formatarAno(veiculo.ano_fabricacao, veiculo.ano_modelo)}
            </li>
            <li className="inline-flex items-center gap-1">
              <Gauge className="size-3.5" />
              {formatarKm(veiculo.km)}
            </li>
            {veiculo.cambio && (
              <li className="inline-flex items-center gap-1">
                <Settings2 className="size-3.5" />
                {rotulo(veiculo.cambio)}
              </li>
            )}
            {veiculo.combustivel && (
              <li className="inline-flex items-center gap-1">
                <Fuel className="size-3.5" />
                {rotulo(veiculo.combustivel)}
              </li>
            )}
          </ul>

          <p className="mt-auto font-heading text-2xl font-extrabold tabular-nums">
            <span className="mr-1 text-sm font-semibold text-muted-foreground">R$</span>
            {formatarPreco(veiculo.preco).replace("R$", "").trim()}
          </p>
        </div>
      </Link>

      {whatsapp && !vendido && (
        <div className="px-4 pb-4">
          <BotaoWhatsapp
            whatsapp={whatsapp}
            veiculo={veiculo}
            siteUrl={siteUrl}
            rotulo="Tenho interesse"
            size="default"
            variante="contorno"
            className="w-full"
          />
        </div>
      )}
    </article>
  );
}
