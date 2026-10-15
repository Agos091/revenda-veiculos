"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BotaoWhatsapp } from "@/components/site/botao-whatsapp";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/veiculos", label: "Estoque" },
  { href: "/#por-que", label: "Por que aqui" },
  { href: "/#contato", label: "Contato" },
];

export function Cabecalho({
  nomeLoja,
  whatsapp,
}: {
  nomeLoja: string;
  whatsapp: string;
}) {
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 8);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors",
        rolou ? "border-b bg-background/80 backdrop-blur" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="font-heading text-lg font-extrabold tracking-tight">
          {nomeLoja}
          <span className="text-primary">.</span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto">
          {whatsapp && <BotaoWhatsapp whatsapp={whatsapp} size="sm" rotulo="WhatsApp" />}
        </div>
      </div>
    </header>
  );
}
