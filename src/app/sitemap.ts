import type { MetadataRoute } from "next";
import { listarSlugs } from "@/lib/veiculos/publico";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.siteUrl;

  const fixas: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/veiculos`, changeFrequency: "daily", priority: 0.9 },
  ];

  const veiculos = await listarSlugs().catch(() => []);

  return [
    ...fixas,
    ...veiculos.map((v) => ({
      url: `${base}/veiculos/${v.slug}`,
      lastModified: new Date(v.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
