import { describe, expect, it } from "vitest";
import {
  formatarAno,
  formatarKm,
  formatarPreco,
  gerarSlug,
  rotulo,
  tituloVeiculo,
} from "@/lib/format";

describe("formatarPreco", () => {
  it("usa ponto de milhar e não mostra centavos", () => {
    expect(formatarPreco(98900).replace(/ /g, " ")).toBe("R$ 98.900");
  });

  it("arredonda centavos em vez de exibi-los", () => {
    expect(formatarPreco(98900.49).replace(/ /g, " ")).toBe("R$ 98.900");
  });

  it("formata valores na casa do milhão", () => {
    expect(formatarPreco(1250000).replace(/ /g, " ")).toBe("R$ 1.250.000");
  });
});

describe("formatarKm", () => {
  it("usa ponto de milhar e sufixo km", () => {
    expect(formatarKm(45000)).toBe("45.000 km");
  });

  it("aceita zero km", () => {
    expect(formatarKm(0)).toBe("0 km");
  });
});

describe("formatarAno", () => {
  it("mostra só um ano quando fabricação e modelo coincidem", () => {
    expect(formatarAno(2021, 2021)).toBe("2021");
  });

  it("mostra fabricação/modelo quando são diferentes", () => {
    expect(formatarAno(2019, 2020)).toBe("2019/2020");
  });
});

describe("rotulo", () => {
  it("traduz os valores do banco", () => {
    expect(rotulo("automatico")).toBe("Automático");
    expect(rotulo("sedan")).toBe("Sedã");
    expect(rotulo("disponivel")).toBe("Disponível");
  });

  it("devolve travessão para nulo", () => {
    expect(rotulo(null)).toBe("—");
    expect(rotulo(undefined)).toBe("—");
  });

  it("devolve o próprio valor quando não conhece o rótulo", () => {
    expect(rotulo("turbo-foguete")).toBe("turbo-foguete");
  });
});

describe("tituloVeiculo", () => {
  it("junta marca, modelo e versão", () => {
    expect(tituloVeiculo({ marca: "Honda", modelo: "Civic", versao: "EXL" })).toBe(
      "Honda Civic EXL",
    );
  });

  it("ignora versão vazia", () => {
    expect(tituloVeiculo({ marca: "Fiat", modelo: "Uno", versao: null })).toBe("Fiat Uno");
  });
});

describe("gerarSlug", () => {
  it("tira acento e símbolo", () => {
    expect(gerarSlug("Citroën C3 Attraction 1.6")).toBe("citroen-c3-attraction-1-6");
  });

  it("não deixa hífen sobrando nas pontas", () => {
    expect(gerarSlug("  Ford Ka!  ")).toBe("ford-ka");
  });
});
