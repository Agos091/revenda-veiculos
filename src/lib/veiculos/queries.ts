import "server-only";
import { createClient } from "@/lib/supabase/server";
import { CONFIGURACOES_DEMO, modoDemo, VEICULOS_DEMO } from "@/lib/veiculos/demo";
import type {
  Configuracoes,
  StatusVeiculo,
  Veiculo,
  VeiculoComFotos,
  VeiculoFoto,
} from "@/types/database";

export interface FiltroAdmin {
  busca?: string;
  status?: StatusVeiculo | "todos";
}

/** Lista para a tabela do admin (inclui inativos). */
export async function listarVeiculosAdmin(
  filtro: FiltroAdmin = {},
): Promise<VeiculoComFotos[]> {
  // no modo demo só a leitura é simulada: salvar e excluir seguem exigindo Supabase
  if (modoDemo()) {
    const busca = filtro.busca?.trim().toLowerCase();
    return VEICULOS_DEMO.filter((v) => {
      if (filtro.status && filtro.status !== "todos" && v.status !== filtro.status) {
        return false;
      }
      if (busca) {
        const alvo = `${v.marca} ${v.modelo} ${v.versao ?? ""}`.toLowerCase();
        if (!alvo.includes(busca)) return false;
      }
      return true;
    });
  }

  const supabase = await createClient();
  let query = supabase
    .from("veiculos")
    .select("*, fotos:veiculo_fotos(*)")
    .order("created_at", { ascending: false });

  if (filtro.status && filtro.status !== "todos") {
    query = query.eq("status", filtro.status);
  }

  const busca = filtro.busca?.trim();
  if (busca) {
    const termo = `%${busca}%`;
    query = query.or(
      `marca.ilike.${termo},modelo.ilike.${termo},versao.ilike.${termo}`,
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as VeiculoComFotos[];
}

export async function obterVeiculo(id: string): Promise<VeiculoComFotos | null> {
  if (modoDemo()) return VEICULOS_DEMO.find((v) => v.id === id) ?? null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("veiculos")
    .select("*, fotos:veiculo_fotos(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const veiculo = data as unknown as VeiculoComFotos;
  veiculo.fotos = [...(veiculo.fotos ?? [])].sort(
    (a: VeiculoFoto, b: VeiculoFoto) => a.ordem - b.ordem,
  );
  return veiculo;
}

export interface MetricasDashboard {
  disponiveis: number;
  reservados: number;
  vendidosNoMes: number;
  cliquesNaSemana: number;
  ultimos: Veiculo[];
}

export async function obterMetricas(): Promise<MetricasDashboard> {
  if (modoDemo()) {
    const contar = (status: string) =>
      VEICULOS_DEMO.filter((v) => v.status === status).length;
    return {
      disponiveis: contar("disponivel"),
      reservados: contar("reservado"),
      vendidosNoMes: contar("vendido"),
      cliquesNaSemana: 12,
      ultimos: VEICULOS_DEMO.slice(0, 5),
    };
  }

  const supabase = await createClient();

  const agora = new Date();
  const inicioDoMes = new Date(agora.getFullYear(), agora.getMonth(), 1).toISOString();
  const seteDiasAtras = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const contar = (status: StatusVeiculo) =>
    supabase
      .from("veiculos")
      .select("id", { count: "exact", head: true })
      .eq("status", status);

  const [disponiveis, reservados, vendidos, cliques, ultimos] = await Promise.all([
    contar("disponivel"),
    contar("reservado"),
    supabase
      .from("veiculos")
      .select("id", { count: "exact", head: true })
      .eq("status", "vendido")
      .gte("updated_at", inicioDoMes),
    supabase
      .from("cliques_whatsapp")
      .select("id", { count: "exact", head: true })
      .gte("created_at", seteDiasAtras),
    supabase
      .from("veiculos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    disponiveis: disponiveis.count ?? 0,
    reservados: reservados.count ?? 0,
    vendidosNoMes: vendidos.count ?? 0,
    cliquesNaSemana: cliques.count ?? 0,
    ultimos: (ultimos.data ?? []) as Veiculo[],
  };
}

export async function obterConfiguracoes(): Promise<Configuracoes | null> {
  if (modoDemo()) return CONFIGURACOES_DEMO;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("configuracoes")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Configuracoes | null;
}
