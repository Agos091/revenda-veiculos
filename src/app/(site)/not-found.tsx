import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NaoEncontrado() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-5 px-4 text-center">
      <p className="font-heading text-6xl font-extrabold text-primary">404</p>
      <h1 className="font-heading text-2xl font-bold">Esse veículo não está mais no ar</h1>
      <p className="text-muted-foreground">
        Pode ter sido vendido ou saído do estoque. Veja o que temos agora — ou chame a
        gente no WhatsApp que a gente procura o carro que você quer.
      </p>
      <Button asChild size="lg">
        <Link href="/veiculos">Ver estoque</Link>
      </Button>
    </main>
  );
}
