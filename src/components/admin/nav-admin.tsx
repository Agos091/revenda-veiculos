"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Painel", icone: LayoutDashboard, exato: true },
  { href: "/admin/veiculos", label: "Veículos", icone: Car, exato: false },
  { href: "/admin/configuracoes", label: "Configurações", icone: Settings, exato: false },
];

export function NavAdmin() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {LINKS.map(({ href, label, icone: Icone, exato }) => {
        const ativo = exato ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors",
              ativo
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icone className="size-4" />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
