/**
 * Tipos do banco — espelham supabase/migrations/0001_init.sql.
 * Para regerar a partir do projeto real:
 *   npx supabase gen types typescript --project-id <id> > src/types/database.ts
 */

export type StatusVeiculo = "disponivel" | "reservado" | "vendido" | "inativo";
export type Carroceria =
  | "hatch"
  | "sedan"
  | "suv"
  | "picape"
  | "van"
  | "coupe";
export type Combustivel =
  | "flex"
  | "gasolina"
  | "etanol"
  | "diesel"
  | "hibrido"
  | "eletrico";
export type Cambio = "manual" | "automatico" | "automatizado" | "cvt";

export interface Veiculo {
  id: string;
  slug: string;
  status: StatusVeiculo;
  destaque: boolean;
  marca: string;
  modelo: string;
  versao: string | null;
  ano_fabricacao: number;
  ano_modelo: number;
  carroceria: Carroceria | null;
  cor: string | null;
  final_placa: number | null;
  combustivel: Combustivel | null;
  cambio: Cambio | null;
  motor: string | null;
  portas: number | null;
  km: number;
  preco: number;
  preco_fipe: number | null;
  aceita_troca: boolean;
  aceita_financiamento: boolean;
  unico_dono: boolean;
  ipva_pago: boolean;
  licenciado: boolean;
  revisoes_concessionaria: boolean;
  laudo_cautelar: boolean;
  garantia_fabrica: boolean;
  opcionais: string[];
  descricao: string | null;
  created_at: string;
  updated_at: string;
}

export interface VeiculoFoto {
  id: string;
  veiculo_id: string;
  url: string;
  ordem: number;
  is_capa: boolean;
  created_at: string;
}

export interface Configuracoes {
  id: number;
  nome_loja: string;
  whatsapp: string;
  endereco: string | null;
  cidade: string | null;
  horario: string | null;
  instagram: string | null;
  updated_at: string;
}

export interface CliqueWhatsapp {
  id: string;
  veiculo_id: string | null;
  created_at: string;
}

/** Veículo com as fotos já carregadas (join usado nas páginas públicas). */
export type VeiculoComFotos = Veiculo & { fotos: VeiculoFoto[] };

type Insert<T, Gerados extends keyof T> = Omit<T, Gerados> & Partial<Pick<T, Gerados>>;

export interface Database {
  public: {
    Tables: {
      veiculos: {
        Row: Veiculo;
        Insert: Insert<Veiculo, "id" | "created_at" | "updated_at" | "slug">;
        Update: Partial<Veiculo>;
      };
      veiculo_fotos: {
        Row: VeiculoFoto;
        Insert: Insert<VeiculoFoto, "id" | "created_at">;
        Update: Partial<VeiculoFoto>;
      };
      configuracoes: {
        Row: Configuracoes;
        Insert: Insert<Configuracoes, "id" | "updated_at">;
        Update: Partial<Configuracoes>;
      };
      cliques_whatsapp: {
        Row: CliqueWhatsapp;
        Insert: Insert<CliqueWhatsapp, "id" | "created_at">;
        Update: Partial<CliqueWhatsapp>;
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: {
      status_veiculo: StatusVeiculo;
      carroceria: Carroceria;
      combustivel: Combustivel;
      cambio: Cambio;
    };
  };
}
