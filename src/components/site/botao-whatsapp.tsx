"use client";

import { MessageCircle } from "lucide-react";
import { registrarClique } from "@/lib/veiculos/actions";
import { linkWhatsapp } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface VeiculoDoContato {
  id: string;
  marca: string;
  modelo: string;
  versao?: string | null;
  ano_modelo: number;
  preco: number;
  slug: string;
}

interface Props {
  whatsapp: string;
  veiculo?: VeiculoDoContato;
  siteUrl?: string;
  rotulo?: string;
  className?: string;
  size?: React.ComponentProps<typeof Button>["size"];
  variante?: "solido" | "contorno";
}

/** Abre o wa.me com a mensagem pronta e registra o clique. */
export function BotaoWhatsapp({
  whatsapp,
  veiculo,
  siteUrl,
  rotulo = "Chamar no WhatsApp",
  className,
  size = "lg",
  variante = "solido",
}: Props) {
  const href = linkWhatsapp(whatsapp, veiculo, siteUrl);

  return (
    <Button
      asChild
      size={size}
      className={cn(
        variante === "solido"
          ? "bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp-hover"
          : "border-whatsapp/60 bg-transparent text-whatsapp hover:bg-whatsapp/10",
        className,
      )}
      variant={variante === "solido" ? "default" : "outline"}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => void registrarClique(veiculo?.id ?? null)}
      >
        <MessageCircle className="size-4" />
        {rotulo}
      </a>
    </Button>
  );
}

/** Botão flutuante presente em todas as páginas públicas. */
export function WhatsappFlutuante({ whatsapp }: { whatsapp: string }) {
  if (!whatsapp) return null;

  return (
    <a
      href={linkWhatsapp(whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chamar no WhatsApp"
      onClick={() => void registrarClique(null)}
      className="fixed right-4 bottom-4 z-40 flex size-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg transition-transform hover:scale-105 md:right-6 md:bottom-6"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}
