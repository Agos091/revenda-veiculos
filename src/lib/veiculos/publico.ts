import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  Cambio,
  Carroceria,
  Combustivel,
  StatusVeiculo,
  VeiculoComFotos,
} from "@/types/database";

export const POR_PAGINA = 12;

export type Ordenacao =
  | "recentes"
  | "menor-preco"
  | "maior-preco"
  | "mais-novo"
  | "menor-km";

export interface FiltrosPublicos {
  marca?: string;
  modelo?: string;
  precoMin?: number;
  precoMax?: number;
  anoMin?: number;
  anoMax?: number;
  kmMax?: number;
  cambio?: Cambio;
  combustivel?: Combustivel;
  carroceria?: Carroceria;
  aceitaTroca?: boolean;
  aceitaFinanciamento?: boolean;
  ordenar?: Ordenacao;
  pagina?: number;
}

const ORDENS: Record<Ordenacao, { coluna: string; crescente: boolean }> = {
  recentes: { coluna: "created_at", crescente: false },
  "menor-preco": { coluna: "preco", crescente: true },
  "maior-preco": { coluna: "preco", crescente: false },
  "mais-novo": { coluna: "ano_modelo", crescente: false },
  "menor-km": { coluna: "km", crescente: true },
};

/** Só o que o visitante pode ver: disponível ou reservado (vendido tem página própria). */
const VISIVEIS: StatusVeiculo[] = ["disponivel", "reservado", "vendido"];

export async function listarVeiculosPublico(filtros: FiltrosPublicos = {}): Promise<{
  veiculos: VeiculoComFotos[];
  total: number;
}> {
  const supabase = await createClient();
  const pagina = Math.max(1, filtros.pagina ?? 1);
  const de = (pagina - 1) * POR_PAGINA;

  let query = supabase
    .from("veiculos")
    .select("*, fotos:veiculo_fotos(*)", { count: "exact" })
    .in("status", VISIVEIS);

  if (filtros.marca) query = query.ilike("marca", filtros.marca);
  if (filtros.modelo) query = query.ilike("modelo", `%${filtros.modelo}%`);
  if (filtros.precoMin !== undefined) query = query.gte("preco", filtros.precoMin);
  if (filtros.precoMax !== undefined) query = query.lte("preco", filtros.precoMax);
  if (filtros.anoMin !== undefined) query = query.gte("ano_modelo", filtros.anoMin);
  if (filtros.anoMax !== undefined) query = query.lte("ano_modelo", filtros.anoMax);
  if (filtros.kmMax !== undefined) query = query.lte("km", filtros.kmMax);
  if (filtros.cambio) query = query.eq("cambio", filtros.cambio);
  if (filtros.combustivel) query = query.eq("combustivel", filtros.combustivel);
  if (filtros.carroceria) query = query.eq("carroceria", filtros.carroceria);
  if (filtros.aceitaTroca) query = query.eq("aceita_troca", true);
  if (filtros.aceitaFinanciamento) query = query.eq("aceita_financiamento", true);

  const ordem = ORDENS[filtros.ordenar ?? "recentes"];
  const { data, error, count } = await query
    .order("destaque", { ascending: false })
    .order(ordem.coluna, { ascending: ordem.crescente })
    .range(de, de + POR_PAGINA - 1);

  if (error) throw new Error(error.message);

  return {
    veiculos: (data ?? []) as unknown as VeiculoComFotos[],
    total: count ?? 0,
  };
}

export async function obterVeiculoPorSlug(slug: string): Promise<VeiculoComFotos | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("veiculos")
    .select("*, fotos:veiculo_fotos(*)")
    .eq("slug", slug)
    .in("status", VISIVEIS)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const veiculo = data as unknown as VeiculoComFotos;
  veiculo.fotos = [...(veiculo.fotos ?? [])].sort((a, b) => a.ordem - b.ordem);
  return veiculo;
}

export async function listarDestaques(limite = 6): Promise<VeiculoComFotos[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("veiculos")
    .select("*, fotos:veiculo_fotos(*)")
    .eq("status", "disponivel")
    .eq("destaque", true)
    .order("created_at", { ascending: false })
    .limit(limite);

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as VeiculoComFotos[];
}

/** Mesma carroceria e preço próximo (±30%), fora o próprio carro. */
export async function listarSemelhantes(
  veiculo: VeiculoComFotos,
  limite = 4,
): Promise<VeiculoComFotos[]> {
  const supabase = await createClient();
  let query = supabase
    .from("veiculos")
    .select("*, fotos:veiculo_fotos(*)")
    .eq("status", "disponivel")
    .neq("id", veiculo.id)
    .gte("preco", veiculo.preco * 0.7)
    .lte("preco", veiculo.preco * 1.3);

  if (veiculo.carroceria) query = query.eq("carroceria", veiculo.carroceria);

  const { data, error } = await query.limit(limite);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as VeiculoComFotos[];
}

/** Marcas com veículo à venda, para o select de busca rápida e de filtros. */
export async function listarMarcas(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("veiculos")
    .select("marca")
    .in("status", VISIVEIS);

  if (error) throw new Error(error.message);

  const marcas = new Set((data ?? []).map((v) => v.marca));
  return [...marcas].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

/** Slugs para o sitemap. */
export async function listarSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("veiculos")
    .select("slug, updated_at")
    .in("status", VISIVEIS);

  if (error) throw new Error(error.message);
  return data ?? [];
}
