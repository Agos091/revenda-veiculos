import { Skeleton } from "@/components/ui/skeleton";

export default function CarregandoDetalhe() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Skeleton className="h-4 w-48" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0 space-y-3">
          <Skeleton className="aspect-video w-full" />
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-24 shrink-0" />
            ))}
          </div>
        </div>
        <div className="space-y-4 rounded-xl border p-6">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    </main>
  );
}
