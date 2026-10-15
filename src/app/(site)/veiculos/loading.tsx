import { Skeleton } from "@/components/ui/skeleton";

export default function CarregandoListagem() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="mt-2 h-4 w-32" />
      <Skeleton className="mt-5 h-11 w-full max-w-xl" />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border">
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
