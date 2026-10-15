"use client";

import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function Campo({
  id,
  label,
  erro,
  obrigatorio,
  children,
  className,
}: {
  id: string;
  label: string;
  erro?: string;
  obrigatorio?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {obrigatorio && <span className="ml-0.5 text-primary">*</span>}
      </Label>
      {children}
      {erro && (
        <p role="alert" className="text-xs text-destructive">
          {erro}
        </p>
      )}
    </div>
  );
}

export function CampoTexto({
  id,
  label,
  erro,
  obrigatorio,
  className,
  ...props
}: React.ComponentProps<typeof Input> & {
  id: string;
  label: string;
  erro?: string;
  obrigatorio?: boolean;
}) {
  return (
    <Campo id={id} label={label} erro={erro} obrigatorio={obrigatorio} className={className}>
      <Input id={id} aria-invalid={Boolean(erro)} {...props} />
    </Campo>
  );
}

export function LinhaToggle({
  label,
  descricao,
  children,
}: {
  label: string;
  descricao?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {descricao && <p className="text-xs text-muted-foreground">{descricao}</p>}
      </div>
      {children}
    </div>
  );
}
