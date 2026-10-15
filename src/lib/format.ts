/** Formatação pt-BR usada em cards, ficha técnica e mensagens do WhatsApp. */

/** R$ 98.900 — sem centavos, ponto de milhar. */
export function formatarPreco(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(valor);
}

/** 45.000 km */
export function formatarKm(km: number): string {
  return `${new Intl.NumberFormat("pt-BR").format(km)} km`;
}

/** 2019/2020 — ou só o ano quando fabricação e modelo são iguais. */
export function formatarAno(fabricacao: number, modelo: number): string {
  return fabricacao === modelo ? String(modelo) : `${fabricacao}/${modelo}`;
}

const LABELS: Record<string, string> = {
  // câmbio
  manual: "Manual",
  automatico: "Automático",
  automatizado: "Automatizado",
  cvt: "CVT",
  // combustível
  flex: "Flex",
  gasolina: "Gasolina",
  etanol: "Etanol",
  diesel: "Diesel",
  hibrido: "Híbrido",
  eletrico: "Elétrico",
  // carroceria
  hatch: "Hatch",
  sedan: "Sedã",
  suv: "SUV",
  picape: "Picape",
  van: "Van",
  coupe: "Cupê",
  // status
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
  inativo: "Inativo",
};

/** "automatico" -> "Automático" */
export function rotulo(valor: string | null | undefined): string {
  if (!valor) return "—";
  return LABELS[valor] ?? valor;
}

/** "Honda Civic EXL" a partir de marca/modelo/versão. */
export function tituloVeiculo(veiculo: {
  marca: string;
  modelo: string;
  versao?: string | null;
}): string {
  return [veiculo.marca, veiculo.modelo, veiculo.versao]
    .filter(Boolean)
    .join(" ");
}

/** honda-civic-exl-2020 (sem acento, sem símbolo). */
export function gerarSlug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
