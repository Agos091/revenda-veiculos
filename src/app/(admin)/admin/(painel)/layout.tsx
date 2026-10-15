import Link from "next/link";
import { LogOut } from "lucide-react";
import { sair } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { NavAdmin } from "@/components/admin/nav-admin";
import { Button } from "@/components/ui/button";

export default async function PainelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // o middleware já barra quem não está logado; aqui é só para mostrar o email
  let email: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email ?? null;
  } catch {
    email = null;
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <Link href="/admin" className="font-heading text-sm font-bold tracking-tight">
            Revenda<span className="text-primary">.</span>
          </Link>
          <NavAdmin />
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground md:inline">
              {email}
            </span>
            <form action={sair}>
              <Button type="submit" variant="ghost" size="sm" title="Sair">
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
