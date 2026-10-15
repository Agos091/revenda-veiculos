import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { obterVeiculo } from "@/lib/veiculos/queries";
import { tituloVeiculo } from "@/lib/format";
import { FormularioVeiculo } from "@/components/admin/formulario-veiculo";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function EditarVeiculoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const veiculo = await obterVeiculo(id);
  if (!veiculo) notFound();

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header className="space-y-2">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/admin/veiculos">
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          {tituloVeiculo(veiculo)} {veiculo.ano_modelo}
        </h1>
        <p className="text-sm text-muted-foreground">
          {veiculo.fotos.length} foto{veiculo.fotos.length === 1 ? "" : "s"} · /{veiculo.slug}
        </p>
      </header>

      <FormularioVeiculo veiculo={veiculo} />
    </main>
  );
}
