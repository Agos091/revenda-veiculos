import Link from "next/link";
import { AtSign, Clock, MapPin } from "lucide-react";
import type { Configuracoes } from "@/types/database";

export function Rodape({ configuracoes }: { configuracoes: Configuracoes | null }) {
  return (
    <footer id="contato" className="mt-20 border-t bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <p className="font-heading text-lg font-extrabold">
            {configuracoes?.nome_loja ?? "Revenda"}
            <span className="text-primary">.</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Carros seminovos revisados, com procedência e documentação em dia.
          </p>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          {configuracoes?.endereco && (
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>
                {configuracoes.endereco}
                {configuracoes.cidade ? ` — ${configuracoes.cidade}` : ""}
              </span>
            </p>
          )}
          {configuracoes?.horario && (
            <p className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 shrink-0" />
              {configuracoes.horario}
            </p>
          )}
          {configuracoes?.instagram && (
            <a
              href={`https://instagram.com/${configuracoes.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <AtSign className="size-4" />@{configuracoes.instagram.replace("@", "")}
            </a>
          )}
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <Link href="/veiculos" className="block transition-colors hover:text-foreground">
            Ver estoque
          </Link>
          <Link href="/admin" className="block transition-colors hover:text-foreground">
            Área do vendedor
          </Link>
        </div>
      </div>

      <div className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {configuracoes?.nome_loja ?? "Revenda"}. Todos os
        direitos reservados.
      </div>
    </footer>
  );
}
