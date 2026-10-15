import { formatarPreco, tituloVeiculo } from "@/lib/format";

/** Só dígitos: "(11) 99999-9999" -> "5511999999999" */
export function normalizarNumero(whatsapp: string): string {
  const digitos = whatsapp.replace(/\D/g, "");
  return digitos.startsWith("55") ? digitos : `55${digitos}`;
}

interface VeiculoParaMensagem {
  marca: string;
  modelo: string;
  versao?: string | null;
  ano_modelo: number;
  preco: number;
  slug: string;
}

/**
 * Link wa.me com mensagem pronta citando o carro e a URL da página.
 * Ex.: "Olá! Vi o *Honda Civic EXL 2020* por R$ 98.900 no site e tenho interesse."
 */
export function linkWhatsapp(
  whatsapp: string,
  veiculo?: VeiculoParaMensagem,
  siteUrl?: string,
): string {
  const numero = normalizarNumero(whatsapp);

  if (!veiculo) {
    const texto = "Olá! Vi o site e gostaria de falar sobre os veículos disponíveis.";
    return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
  }

  const nome = `${tituloVeiculo(veiculo)} ${veiculo.ano_modelo}`;
  const url = siteUrl ? ` ${siteUrl}/veiculos/${veiculo.slug}` : "";
  const texto = `Olá! Vi o *${nome}* por ${formatarPreco(
    veiculo.preco,
  )} no site e tenho interesse.${url}`;

  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}
