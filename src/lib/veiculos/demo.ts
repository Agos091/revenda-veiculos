import type { Configuracoes, VeiculoComFotos } from "@/types/database";

/**
 * Modo demo: dados de exemplo para ver o site funcionando antes de existir
 * um projeto Supabase. Ligue com NEXT_PUBLIC_DEMO=1 no .env.local.
 * Nunca liga em produção.
 */
export function modoDemo(): boolean {
  return process.env.NEXT_PUBLIC_DEMO === "1" && process.env.NODE_ENV !== "production";
}

const AGORA = new Date("2026-10-01T12:00:00Z").toISOString();

interface Base {
  slug: string;
  marca: string;
  modelo: string;
  versao: string;
  ano_fabricacao: number;
  ano_modelo: number;
  carroceria: VeiculoComFotos["carroceria"];
  cor: string;
  combustivel: VeiculoComFotos["combustivel"];
  cambio: VeiculoComFotos["cambio"];
  motor: string;
  km: number;
  preco: number;
  preco_fipe: number;
  status?: VeiculoComFotos["status"];
  destaque?: boolean;
  opcionais: string[];
  descricao: string;
}

const BASES: Base[] = [
  {
    slug: "honda-civic-exl-2020-a1b2",
    marca: "Honda",
    modelo: "Civic",
    versao: "EXL 2.0 CVT",
    ano_fabricacao: 2019,
    ano_modelo: 2020,
    carroceria: "sedan",
    cor: "Prata",
    combustivel: "flex",
    cambio: "cvt",
    motor: "2.0 16v",
    km: 45000,
    preco: 98900,
    preco_fipe: 101200,
    destaque: true,
    opcionais: ["Bancos de couro", "Câmera de ré", "Multimídia", "Piloto automático"],
    descricao:
      "Único dono, todas as revisões na concessionária e laudo cautelar aprovado. Pneus novos.",
  },
  {
    slug: "jeep-compass-longitude-2021-c3d4",
    marca: "Jeep",
    modelo: "Compass",
    versao: "Longitude 1.3 T270",
    ano_fabricacao: 2021,
    ano_modelo: 2021,
    carroceria: "suv",
    cor: "Branco",
    combustivel: "flex",
    cambio: "automatico",
    motor: "1.3 turbo",
    km: 62000,
    preco: 132900,
    preco_fipe: 135000,
    destaque: true,
    opcionais: ["Faróis de LED", "Sensor de estacionamento", "Start-stop", "Câmera de ré"],
    descricao: "Garantia de fábrica vigente, revisões em dia, segundo dono.",
  },
  {
    slug: "volkswagen-gol-trendline-2018-e5f6",
    marca: "Volkswagen",
    modelo: "Gol",
    versao: "1.0 MPI Trendline",
    ano_fabricacao: 2018,
    ano_modelo: 2018,
    carroceria: "hatch",
    cor: "Vermelho",
    combustivel: "flex",
    cambio: "manual",
    motor: "1.0 12v",
    km: 78500,
    preco: 48900,
    preco_fipe: 50100,
    status: "reservado",
    opcionais: ["Ar-condicionado", "Direção elétrica", "Vidros elétricos", "ABS"],
    descricao: "Econômico, ideal para o dia a dia. Documentação em ordem.",
  },
  {
    slug: "toyota-corolla-xei-2022-g7h8",
    marca: "Toyota",
    modelo: "Corolla",
    versao: "XEi 2.0",
    ano_fabricacao: 2022,
    ano_modelo: 2022,
    carroceria: "sedan",
    cor: "Preto",
    combustivel: "flex",
    cambio: "cvt",
    motor: "2.0 16v",
    km: 31000,
    preco: 145900,
    preco_fipe: 148000,
    destaque: true,
    opcionais: ["Multimídia", "Chave presencial", "Faróis de LED", "Controle de tração"],
    descricao: "Corolla XEi impecável, com manual e chave reserva.",
  },
  {
    slug: "fiat-strada-freedom-2021-i9j0",
    marca: "Fiat",
    modelo: "Strada",
    versao: "Freedom 1.3 CD",
    ano_fabricacao: 2021,
    ano_modelo: 2021,
    carroceria: "picape",
    cor: "Cinza",
    combustivel: "flex",
    cambio: "manual",
    motor: "1.3 8v",
    km: 54000,
    preco: 89900,
    preco_fipe: 91500,
    opcionais: ["Ar-condicionado", "Multimídia", "Vidros elétricos"],
    descricao: "Cabine dupla, nunca trabalhou com carga pesada.",
  },
  {
    slug: "hyundai-hb20-comfort-2019-k1l2",
    marca: "Hyundai",
    modelo: "HB20",
    versao: "Comfort Plus 1.0",
    ano_fabricacao: 2019,
    ano_modelo: 2019,
    carroceria: "hatch",
    cor: "Branco",
    combustivel: "flex",
    cambio: "manual",
    motor: "1.0 12v",
    km: 67000,
    preco: 59900,
    preco_fipe: 61000,
    opcionais: ["Ar-condicionado", "Airbag duplo", "ABS", "Computador de bordo"],
    descricao: "Segundo dono, revisões feitas e pneus com meia-vida.",
  },
  {
    slug: "chevrolet-onix-lt-2020-m3n4",
    marca: "Chevrolet",
    modelo: "Onix",
    versao: "LT 1.0 Turbo",
    ano_fabricacao: 2020,
    ano_modelo: 2020,
    carroceria: "hatch",
    cor: "Azul",
    combustivel: "flex",
    cambio: "automatico",
    motor: "1.0 turbo",
    km: 49000,
    preco: 72900,
    preco_fipe: 74200,
    opcionais: ["Multimídia", "Câmera de ré", "Ar-condicionado digital"],
    descricao: "Onix turbo automático, consumo excelente na estrada.",
  },
  {
    slug: "renault-duster-iconic-2019-o5p6",
    marca: "Renault",
    modelo: "Duster",
    versao: "Iconic 1.6 CVT",
    ano_fabricacao: 2019,
    ano_modelo: 2019,
    carroceria: "suv",
    cor: "Marrom",
    combustivel: "flex",
    cambio: "cvt",
    motor: "1.6 16v",
    km: 83000,
    preco: 84900,
    preco_fipe: 86000,
    status: "vendido",
    opcionais: ["Multimídia", "Sensor de estacionamento", "Rodas de liga leve"],
    descricao: "Duster Iconic completo — já vendido, veja os parecidos.",
  },
];

function montar(base: Base, indice: number): VeiculoComFotos {
  const id = `demo-${indice + 1}`;
  return {
    id,
    slug: base.slug,
    status: base.status ?? "disponivel",
    destaque: base.destaque ?? false,
    marca: base.marca,
    modelo: base.modelo,
    versao: base.versao,
    ano_fabricacao: base.ano_fabricacao,
    ano_modelo: base.ano_modelo,
    carroceria: base.carroceria,
    cor: base.cor,
    final_placa: (indice % 10) as number,
    combustivel: base.combustivel,
    cambio: base.cambio,
    motor: base.motor,
    portas: 4,
    km: base.km,
    preco: base.preco,
    preco_fipe: base.preco_fipe,
    aceita_troca: indice % 2 === 0,
    aceita_financiamento: true,
    unico_dono: indice % 3 === 0,
    ipva_pago: true,
    licenciado: true,
    revisoes_concessionaria: indice % 2 === 0,
    laudo_cautelar: true,
    garantia_fabrica: base.ano_modelo >= 2021,
    opcionais: base.opcionais,
    descricao: base.descricao,
    created_at: AGORA,
    updated_at: AGORA,
    fotos: Array.from({ length: 5 }, (_, i) => ({
      id: `${id}-foto-${i}`,
      veiculo_id: id,
      url: `https://picsum.photos/seed/${base.slug}-${i}/1200/900`,
      ordem: i,
      is_capa: i === 0,
      created_at: AGORA,
    })),
  };
}

export const VEICULOS_DEMO: VeiculoComFotos[] = BASES.map(montar);

export const CONFIGURACOES_DEMO: Configuracoes = {
  id: 1,
  nome_loja: "Minha Revenda",
  whatsapp: "5511999999999",
  endereco: "Av. Exemplo, 1000",
  cidade: "São Paulo/SP",
  horario: "Seg a Sex 9h–18h · Sáb 9h–13h",
  instagram: "minharevenda",
  updated_at: AGORA,
};
