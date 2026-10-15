import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormularioVeiculo } from "@/components/admin/formulario-veiculo";
import { Button } from "@/components/ui/button";

export default function NovoVeiculoPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header className="space-y-2">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/admin/veiculos">
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Novo veículo</h1>
        <p className="text-sm text-muted-foreground">
          Preencha os dados básicos e a ficha técnica; as fotos entram depois de salvar.
        </p>
      </header>

      <FormularioVeiculo />
    </main>
  );
}
