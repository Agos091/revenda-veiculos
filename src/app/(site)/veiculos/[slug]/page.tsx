import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Share2 } from "lucide-react";
import {
  listarSemelhantes,
  obterConfiguracoesPublicas,
  obterVeiculoPorSlug,
} from "@/lib/veiculos/publico";
import { env } from "@/lib/env";
import {
  formatarAno,
  formatarKm,
  formatarPreco,
  rotulo,
  tituloVeiculo,
} from "@/lib/format";
import type { VeiculoComFotos } from "@/types/database";
import { BotaoWhatsapp } from "@/components/site/botao-whatsapp";
import { BotaoCompartilhar } from "@/components/site/botao-compartilhar";
import { CardVeiculo } from "@/components/site/card-veiculo";
import { GaleriaVeiculo } from "@/components/site/galeria-veiculo";
import { Button } from "@/components/ui/button";

export const revalidate = 60;

function capa(veiculo: VeiculoComFotos) {
  const fotos = veiculo.fotos ?? [];
  return fotos.find((f) => f.is_capa) ?? fotos[0] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const veiculo = await obterVeiculoPorSlug(slug).catch(() => null);
  if (!veiculo) return { title: "Veículo não encontrado" };

  const nome = `${tituloVeiculo(veiculo)} ${veiculo.ano_modelo}`;
  const descricao = `${formatarPreco(veiculo.preco)} · ${formatarKm(veiculo.km)} · ${formatarAno(
    veiculo.ano_fabricacao,
    veiculo.ano_modelo,
  )} · ${rotulo(veiculo.cambio)}`;
  const foto = capa(veiculo);

  return {
    title: nome,
    description: descricao,
    alternates: { canonical: `${env.siteUrl}/veiculos/${veiculo.slug}` },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      title: nome,
      description: descricao,
      url: `${env.siteUrl}/veiculos/${veiculo.slug}`,
      images: foto ? [{ url: foto.url, width: 1200, height: 900, alt: nome }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: nome,
      description: descricao,
      images: foto ? [foto.url] : undefined,
    },
  };
}

export default async function DetalheVeiculoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const veiculo = await obterVeiculoPorSlug(slug).catch(() => null);
  if (!veiculo) notFound();

  const [configuracoes, semelhantes] = await Promise.all([
    obterConfiguracoesPublicas().catch(() => null),
    listarSemelhantes(veiculo).catch(() => [] as VeiculoComFotos[]),
  ]);

  const nome = tituloVeiculo(veiculo);
  const nomeCompleto = `${nome} ${veiculo.ano_modelo}`;
  const vendido = veiculo.status === "vendido";
  const whatsapp = configuracoes?.whatsapp ?? "";
  const url = `${env.siteUrl}/veiculos/${veiculo.slug}`;

  const ficha = [
    { label: "Ano", valor: formatarAno(veiculo.ano_fabricacao, veiculo.ano_modelo) },
    { label: "Quilometragem", valor: formatarKm(veiculo.km) },
    { label: "Câmbio", valor: rotulo(veiculo.cambio) },
    { label: "Combustível", valor: rotulo(veiculo.combustivel) },
    { label: "Cor", valor: veiculo.cor ?? "—" },
    { label: "Portas", valor: veiculo.portas ? String(veiculo.portas) : "—" },
    { label: "Motor", valor: veiculo.motor ?? "—" },
    { label: "Carroceria", valor: rotulo(veiculo.carroceria) },
    {
      label: "Final da placa",
      valor: veiculo.final_placa !== null ? String(veiculo.final_placa) : "—",
    },
  ];

  const tags = [
    veiculo.unico_dono && "Único dono",
    veiculo.ipva_pago && "IPVA pago",
    veiculo.licenciado && "Licenciado",
    veiculo.revisoes_concessionaria && "Revisões em concessionária",
    veiculo.laudo_cautelar && "Laudo cautelar",
    veiculo.garantia_fabrica && "Garantia de fábrica",
    veiculo.aceita_troca && "Aceita troca",
    veiculo.aceita_financiamento && "Aceita financiamento",
  ].filter(Boolean) as string[];

  const dadosEstruturados = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: nomeCompleto,
    brand: { "@type": "Brand", name: veiculo.marca },
    model: veiculo.modelo,
    vehicleModelDate: String(veiculo.ano_modelo),
    mileageFromOdometer: { "@type": "QuantitativeValue", value: veiculo.km, unitCode: "KMT" },
    offers: {
      "@type": "Offer",
      price: veiculo.preco,
      priceCurrency: "BRL",
      availability: vendido
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      url,
    },
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 pb-28 lg:pb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados) }}
      />

      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/veiculos" className="transition-colors hover:text-foreground">
          Estoque
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{nomeCompleto}</span>
      </nav>

      {/* no celular a ordem é foto -> preço/CTA -> ficha; no desktop o preço fica à direita */}
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <GaleriaVeiculo fotos={veiculo.fotos} titulo={nomeCompleto} vendido={vendido} />
        </div>

        {/* ---------------------------- coluna lateral --------------------------- */}
        <aside className="min-w-0 space-y-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border bg-card p-6">
            <h1 className="font-heading text-2xl leading-tight font-extrabold">
              {veiculo.marca} {veiculo.modelo}
            </h1>
            {veiculo.versao && (
              <p className="mt-1 text-sm text-muted-foreground">{veiculo.versao}</p>
            )}

            <p className="mt-5 font-heading text-4xl font-extrabold tabular-nums">
              <span className="mr-1 text-lg font-semibold text-muted-foreground">R$</span>
              {formatarPreco(veiculo.preco).replace("R$", "").trim()}
            </p>
            {veiculo.preco_fipe && (
              <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                FIPE: {formatarPreco(veiculo.preco_fipe)}
              </p>
            )}

            {tags.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full bg-elevated px-3 py-1 text-xs text-muted-foreground"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 space-y-2">
              {vendido ? (
                <Button asChild size="lg" className="w-full">
                  <Link href="/veiculos">Ver veículos semelhantes</Link>
                </Button>
              ) : (
                whatsapp && (
                  <BotaoWhatsapp
                    whatsapp={whatsapp}
                    veiculo={veiculo}
                    siteUrl={env.siteUrl}
                    className="w-full"
                  />
                )
              )}
              <BotaoCompartilhar titulo={nomeCompleto} url={url}>
                <Share2 className="size-4" />
                Compartilhar
              </BotaoCompartilhar>
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-10 lg:col-start-1 lg:row-start-2">
          <section>
            <h2 className="font-heading relative inline-block pb-2 text-xl font-bold">
              Ficha técnica
              <span className="absolute inset-x-0 bottom-0 h-[3px] bg-primary" />
            </h2>
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
              {ficha.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                    {item.label}
                  </dt>
                  <dd className="mt-1 font-medium tabular-nums">{item.valor}</dd>
                </div>
              ))}
            </dl>
          </section>

          {veiculo.opcionais.length > 0 && (
            <section>
              <h2 className="font-heading relative inline-block pb-2 text-xl font-bold">
                Opcionais
                <span className="absolute inset-x-0 bottom-0 h-[3px] bg-primary" />
              </h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {veiculo.opcionais.map((o) => (
                  <li
                    key={o}
                    className="rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground"
                  >
                    {o}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {veiculo.descricao && (
            <section>
              <h2 className="font-heading relative inline-block pb-2 text-xl font-bold">
                Sobre o veículo
                <span className="absolute inset-x-0 bottom-0 h-[3px] bg-primary" />
              </h2>
              <p className="mt-5 whitespace-pre-line text-muted-foreground">
                {veiculo.descricao}
              </p>
            </section>
          )}
        </div>

      </div>

      {semelhantes.length > 0 && (
        <section className="mt-16">
          <h2 className="font-heading relative inline-block pb-2 text-xl font-bold">
            Veículos parecidos
            <span className="absolute inset-x-0 bottom-0 h-[3px] bg-primary" />
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {semelhantes.map((v) => (
              <CardVeiculo
                key={v.id}
                veiculo={v}
                whatsapp={whatsapp}
                siteUrl={env.siteUrl}
              />
            ))}
          </div>
        </section>
      )}

      {/* barra fixa do mobile */}
      {!vendido && whatsapp && (
        <div className="barra-contato fixed inset-x-0 bottom-0 z-30 border-t border-t-primary bg-background/95 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <p className="font-heading text-xl font-extrabold tabular-nums">
              {formatarPreco(veiculo.preco)}
            </p>
            <BotaoWhatsapp whatsapp={whatsapp} veiculo={veiculo} siteUrl={env.siteUrl} />
          </div>
        </div>
      )}
    </main>
  );
}
