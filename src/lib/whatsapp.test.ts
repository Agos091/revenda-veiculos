import { describe, expect, it } from "vitest";
import { linkWhatsapp, normalizarNumero } from "@/lib/whatsapp";

const CIVIC = {
  marca: "Honda",
  modelo: "Civic",
  versao: "EXL 2.0 CVT",
  ano_modelo: 2020,
  preco: 98900,
  slug: "honda-civic-exl-2020-a1b2",
};

describe("normalizarNumero", () => {
  it("tira máscara e mantém o 55", () => {
    expect(normalizarNumero("+55 (11) 99999-9999")).toBe("5511999999999");
  });

  it("acrescenta o 55 quando falta", () => {
    expect(normalizarNumero("(11) 99999-9999")).toBe("5511999999999");
  });
});

describe("linkWhatsapp", () => {
  it("monta a mensagem citando carro, ano e preço", () => {
    const url = new URL(linkWhatsapp("5511999999999", CIVIC));
    const texto = url.searchParams.get("text") ?? "";

    expect(url.origin + url.pathname).toBe("https://wa.me/5511999999999");
    expect(texto).toContain("Honda Civic EXL 2.0 CVT 2020");
    expect(texto.replace(/ /g, " ")).toContain("R$ 98.900");
  });

  it("inclui o link do anúncio quando recebe a URL do site", () => {
    const url = new URL(linkWhatsapp("5511999999999", CIVIC, "https://loja.com.br"));
    expect(url.searchParams.get("text")).toContain(
      "https://loja.com.br/veiculos/honda-civic-exl-2020-a1b2",
    );
  });

  it("sem veículo, usa a mensagem genérica", () => {
    const url = new URL(linkWhatsapp("5511999999999"));
    const texto = url.searchParams.get("text") ?? "";
    expect(texto).toContain("veículos disponíveis");
    expect(texto).not.toContain("R$");
  });

  it("escapa o texto para não quebrar a URL", () => {
    const bruto = linkWhatsapp("5511999999999", CIVIC);
    expect(bruto).not.toContain(" ");
    expect(bruto).toContain("%20");
  });
});
