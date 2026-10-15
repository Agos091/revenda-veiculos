import { describe, expect, it } from "vitest";
import {
  listarDestaques,
  listarMarcas,
  listarSemelhantes,
  listarVeiculosPublico,
  obterVeiculoPorSlug,
} from "@/lib/veiculos/publico";

// vitest.config.ts liga NEXT_PUBLIC_DEMO=1: estes testes usam os 8 carros de exemplo.

describe("listarVeiculosPublico", () => {
  it("traz o estoque visível e o total", async () => {
    const { veiculos, total } = await listarVeiculosPublico();
    expect(veiculos.length).toBeGreaterThan(0);
    expect(total).toBe(veiculos.length);
  });

  it("nunca mostra veículo inativo", async () => {
    const { veiculos } = await listarVeiculosPublico();
    expect(veiculos.every((v) => v.status !== "inativo")).toBe(true);
  });

  it("coloca os destaques na frente", async () => {
    const { veiculos } = await listarVeiculosPublico();
    const primeiroSemDestaque = veiculos.findIndex((v) => !v.destaque);
    const ultimoComDestaque = veiculos.map((v) => v.destaque).lastIndexOf(true);
    expect(ultimoComDestaque).toBeLessThan(
      primeiroSemDestaque === -1 ? veiculos.length : primeiroSemDestaque,
    );
  });

  it("filtra por busca livre em marca e modelo", async () => {
    const { veiculos } = await listarVeiculosPublico({ busca: "civic" });
    expect(veiculos).toHaveLength(1);
    expect(veiculos[0].modelo).toBe("Civic");
  });

  it("ignora caixa alta na busca", async () => {
    const { veiculos } = await listarVeiculosPublico({ busca: "HONDA" });
    expect(veiculos[0].marca).toBe("Honda");
  });

  it("respeita a faixa de preço", async () => {
    const { veiculos } = await listarVeiculosPublico({ precoMin: 50000, precoMax: 100000 });
    expect(veiculos.length).toBeGreaterThan(0);
    expect(veiculos.every((v) => v.preco >= 50000 && v.preco <= 100000)).toBe(true);
  });

  it("respeita km máximo", async () => {
    const { veiculos } = await listarVeiculosPublico({ kmMax: 50000 });
    expect(veiculos.every((v) => v.km <= 50000)).toBe(true);
  });

  it("filtra por carroceria e câmbio juntos", async () => {
    const { veiculos } = await listarVeiculosPublico({ carroceria: "suv", cambio: "automatico" });
    expect(veiculos.every((v) => v.carroceria === "suv" && v.cambio === "automatico")).toBe(
      true,
    );
  });

  it("ordena por menor preço", async () => {
    const { veiculos } = await listarVeiculosPublico({ ordenar: "menor-preco" });
    const semDestaque = veiculos.filter((v) => !v.destaque).map((v) => v.preco);
    expect([...semDestaque].sort((a, b) => a - b)).toEqual(semDestaque);
  });

  it("ordena por menor km", async () => {
    const { veiculos } = await listarVeiculosPublico({ ordenar: "menor-km" });
    const semDestaque = veiculos.filter((v) => !v.destaque).map((v) => v.km);
    expect([...semDestaque].sort((a, b) => a - b)).toEqual(semDestaque);
  });

  it("devolve lista vazia quando nada casa com o filtro", async () => {
    const { veiculos, total } = await listarVeiculosPublico({ busca: "lamborghini" });
    expect(veiculos).toHaveLength(0);
    expect(total).toBe(0);
  });

  it("pagina sem repetir veículo", async () => {
    const primeira = await listarVeiculosPublico({ pagina: 1 });
    const segunda = await listarVeiculosPublico({ pagina: 2 });
    const ids = new Set(primeira.veiculos.map((v) => v.id));
    expect(segunda.veiculos.some((v) => ids.has(v.id))).toBe(false);
  });
});

describe("obterVeiculoPorSlug", () => {
  it("acha pelo slug e traz as fotos ordenadas", async () => {
    const veiculo = await obterVeiculoPorSlug("honda-civic-exl-2020-a1b2");
    expect(veiculo?.marca).toBe("Honda");
    const ordens = veiculo?.fotos.map((f) => f.ordem) ?? [];
    expect([...ordens].sort((a, b) => a - b)).toEqual(ordens);
  });

  it("tem exatamente uma capa", async () => {
    const veiculo = await obterVeiculoPorSlug("honda-civic-exl-2020-a1b2");
    expect(veiculo?.fotos.filter((f) => f.is_capa)).toHaveLength(1);
  });

  it("devolve null para slug inexistente", async () => {
    expect(await obterVeiculoPorSlug("carro-que-nao-existe")).toBeNull();
  });
});

describe("listarDestaques", () => {
  it("só traz destaque disponível", async () => {
    const destaques = await listarDestaques();
    expect(destaques.length).toBeGreaterThan(0);
    expect(destaques.every((v) => v.destaque && v.status === "disponivel")).toBe(true);
  });
});

describe("listarSemelhantes", () => {
  it("não inclui o próprio carro nem vendidos", async () => {
    const civic = await obterVeiculoPorSlug("honda-civic-exl-2020-a1b2");
    const semelhantes = await listarSemelhantes(civic!);
    expect(semelhantes.every((v) => v.id !== civic!.id)).toBe(true);
    expect(semelhantes.every((v) => v.status === "disponivel")).toBe(true);
  });
});

describe("listarMarcas", () => {
  it("devolve marcas únicas em ordem alfabética", async () => {
    const marcas = await listarMarcas();
    expect(new Set(marcas).size).toBe(marcas.length);
    expect([...marcas].sort((a, b) => a.localeCompare(b, "pt-BR"))).toEqual(marcas);
  });
});
