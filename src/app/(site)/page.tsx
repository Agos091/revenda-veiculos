import Link from "next/link";
import { BadgeCheck, Banknote, FileCheck2, MapPin, Repeat } from "lucide-react";
import { listarDestaques, listarVeiculosPublico } from "@/lib/veiculos/publico";
import { obterConfiguracoesPublicas } from "@/lib/veiculos/publico";
import type { VeiculoComFotos } from "@/types/database";
import { AtalhosDeFiltro, BuscaEstoque } from "@/components/site/busca-estoque";
import { CardVeiculo } from "@/components/site/card-veiculo";
import { env } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

// catálogo muda pouco: cache de 1 minuto, revalidado na hora quando o vendedor salva
export const revalidate = 60;

const DIFERENCIAIS = [
  {
    icone: BadgeCheck,
    titulo: "Procedência",
    texto: "Histórico conferido e documentação em dia antes de entrar no pátio.",
  },
  {
    icone: FileCheck2,
    titulo: "Laudo cautelar",
    texto: "Vistoria independente disponível para consulta de cada veículo.",
  },
  {
    icone: Banknote,
    titulo: "Financiamento",
    texto: "Simulação na hora com os principais bancos, entrada a combinar.",
  },
  {
    icone: Repeat,
    titulo: "Aceitamos troca",
    texto: "Avaliamos o seu usado e abatemos no valor do próximo carro.",
  },
];

export default async function HomePage() {
  const [destaques, estoque, configuracoes] = await Promise.all([
    listarDestaques().catch(() => [] as VeiculoComFotos[]),
    listarVeiculosPublico({ pagina: 1 })
      .then((r) => r.veiculos)
      .catch(() => [] as VeiculoComFotos[]),
    obterConfiguracoesPublicas().catch(() => null),
  ]);

  // a vitrine nunca fica vazia: o que falta de destaque é completado com o estoque
  const vitrine = [
    ...destaques,
    ...estoque.filter((v) => !destaques.some((d) => d.id === v.id)),
  ].slice(0, 6);
  const whatsapp = configuracoes?.whatsapp ?? "";

  return (
    <main>
      {/* ------------------------------- hero ------------------------------- */}
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(225,6,0,0.18),transparent_60%)]"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            {configuracoes?.cidade ?? "Seminovos selecionados"}
          </p>
          <h1 className="font-heading max-w-2xl text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-6xl">
            Seu próximo carro,
            <br />
            <span className="text-primary">sem surpresa.</span>
          </h1>
          <p className="mt-5 max-w-xl text-muted-foreground">
            Estoque revisado, ficha técnica completa e atendimento direto no WhatsApp.
            Sem burocracia e sem letra miúda.
          </p>

          <div className="mt-8 max-w-xl">
            <Suspense fallback={null}>
              <BuscaEstoque />
            </Suspense>
          </div>

          <div className="mt-4 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <Suspense fallback={null}>
              <AtalhosDeFiltro />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ----------------------------- destaques ---------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading relative inline-block pb-2 text-2xl font-bold tracking-tight">
              No pátio agora
              <span className="absolute inset-x-0 bottom-0 h-[3px] bg-primary" />
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Clique no carro para ver tudo — ou chame no WhatsApp direto do card.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/veiculos">Ver todos</Link>
          </Button>
        </div>

        {vitrine.length === 0 ? (
          <p className="rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground">
            Estoque sendo atualizado. Fale com a gente no WhatsApp que a gente procura
            o carro para você.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vitrine.map((v, i) => (
              <CardVeiculo
                key={v.id}
                veiculo={v}
                whatsapp={whatsapp}
                siteUrl={env.siteUrl}
                prioridade={i < 3}
              />
            ))}
          </div>
        )}
      </section>

      {/* --------------------------- por que aqui --------------------------- */}
      <section id="por-que" className="border-y bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-heading relative inline-block pb-2 text-2xl font-bold tracking-tight">
            Por que comprar aqui
            <span className="absolute inset-x-0 bottom-0 h-[3px] bg-primary" />
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DIFERENCIAIS.map(({ icone: Icone, titulo, texto }) => (
              <div key={titulo} className="space-y-3">
                <span className="inline-flex size-11 items-center justify-center rounded-full border border-primary/40 text-primary">
                  <Icone className="size-5" />
                </span>
                <h3 className="font-heading font-bold">{titulo}</h3>
                <p className="text-sm text-muted-foreground">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------- localização --------------------------- */}
      {(configuracoes?.endereco || configuracoes?.horario) && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-heading relative inline-block pb-2 text-2xl font-bold tracking-tight">
            Onde estamos
            <span className="absolute inset-x-0 bottom-0 h-[3px] bg-primary" />
          </h2>
          <div className="mt-6 grid gap-6 rounded-xl border bg-card p-6 sm:grid-cols-2">
            {configuracoes?.endereco && (
              <div>
                <p className="text-xs tracking-wide text-muted-foreground uppercase">
                  Endereço
                </p>
                <p className="mt-1">
                  {configuracoes.endereco}
                  {configuracoes.cidade ? ` — ${configuracoes.cidade}` : ""}
                </p>
              </div>
            )}
            {configuracoes?.horario && (
              <div>
                <p className="text-xs tracking-wide text-muted-foreground uppercase">
                  Horário
                </p>
                <p className="mt-1">{configuracoes.horario}</p>
              </div>
            )}

            {configuracoes?.endereco && (
              <div className="sm:col-span-2">
                {/* abre o app de mapas do celular em vez de carregar um iframe pesado */}
                <Button asChild variant="outline">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      [configuracoes.endereco, configuracoes.cidade]
                        .filter(Boolean)
                        .join(", "),
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="size-4" />
                    Como chegar
                  </a>
                </Button>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
