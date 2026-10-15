import type { Cambio, Carroceria, Combustivel, StatusVeiculo } from "@/types/database";

export interface Opcao<T extends string> {
  valor: T;
  label: string;
}

export const STATUS: Opcao<StatusVeiculo>[] = [
  { valor: "disponivel", label: "Disponível" },
  { valor: "reservado", label: "Reservado" },
  { valor: "vendido", label: "Vendido" },
  { valor: "inativo", label: "Inativo" },
];

export const CARROCERIAS: Opcao<Carroceria>[] = [
  { valor: "hatch", label: "Hatch" },
  { valor: "sedan", label: "Sedã" },
  { valor: "suv", label: "SUV" },
  { valor: "picape", label: "Picape" },
  { valor: "van", label: "Van" },
  { valor: "coupe", label: "Cupê" },
];

export const COMBUSTIVEIS: Opcao<Combustivel>[] = [
  { valor: "flex", label: "Flex" },
  { valor: "gasolina", label: "Gasolina" },
  { valor: "etanol", label: "Etanol" },
  { valor: "diesel", label: "Diesel" },
  { valor: "hibrido", label: "Híbrido" },
  { valor: "eletrico", label: "Elétrico" },
];

export const CAMBIOS: Opcao<Cambio>[] = [
  { valor: "manual", label: "Manual" },
  { valor: "automatico", label: "Automático" },
  { valor: "automatizado", label: "Automatizado" },
  { valor: "cvt", label: "CVT" },
];

/** Opcionais agrupados — viram um grid de checkboxes no formulário. */
export const GRUPOS_DE_OPCIONAIS: { grupo: string; itens: string[] }[] = [
  {
    grupo: "Conforto",
    itens: [
      "Ar-condicionado",
      "Ar-condicionado digital",
      "Direção elétrica",
      "Vidros elétricos",
      "Travas elétricas",
      "Bancos de couro",
      "Bancos elétricos",
      "Teto solar",
    ],
  },
  {
    grupo: "Segurança",
    itens: [
      "Airbag duplo",
      "Airbag lateral",
      "ABS",
      "Controle de tração",
      "Controle de estabilidade",
      "Sensor de estacionamento",
      "Câmera de ré",
      "Isofix",
    ],
  },
  {
    grupo: "Tecnologia",
    itens: [
      "Multimídia",
      "Apple CarPlay / Android Auto",
      "Piloto automático",
      "Start-stop",
      "Computador de bordo",
      "Chave presencial",
      "Partida por botão",
    ],
  },
  {
    grupo: "Estética",
    itens: [
      "Rodas de liga leve",
      "Faróis de LED",
      "Faróis de neblina",
      "Vidros escurecidos",
      "Engate",
      "Pintura metálica",
    ],
  },
];

export const TODOS_OS_OPCIONAIS = GRUPOS_DE_OPCIONAIS.flatMap((g) => g.itens);

export const LIMITE_DE_FOTOS = 20;
