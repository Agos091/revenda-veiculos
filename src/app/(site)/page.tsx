import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-10 px-4 py-16">
      <div className="space-y-4">
        <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
          Estoque de seminovos
        </p>
        <h1 className="font-heading text-5xl font-extrabold tracking-tight sm:text-6xl">
          Seu próximo carro
          <br />
          <span className="text-primary">com procedência.</span>
        </h1>
        <p className="max-w-prose text-muted-foreground">
          Catálogo público com filtros, ficha técnica completa e contato direto no
          WhatsApp. Área do vendedor em{" "}
          <Link href="/admin" className="text-primary underline-offset-4 hover:underline">
            /admin
          </Link>
          .
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button className="shadow-none hover:shadow-glow">Ver estoque</Button>
        <Button
          className="bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp-hover"
          variant="default"
        >
          Chamar no WhatsApp
        </Button>
        <Button variant="outline">Sobre a loja</Button>
      </div>

      <div className="relative overflow-hidden rounded-xl border bg-card p-6">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-primary" />
        <h2 className="font-heading text-lg font-bold">Fase 0 concluída</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Next.js 15 · TypeScript · Tailwind v4 · shadcn/ui · tokens preto/branco/vermelho ·
          cliente Supabase. Próximo: rodar o SQL da Fase 1 no projeto Supabase.
        </p>
      </div>
    </main>
  );
}
