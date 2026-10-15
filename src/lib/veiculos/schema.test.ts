import { describe, expect, it } from "vitest";
import { configuracoesSchema, veiculoSchema } from "@/lib/veiculos/schema";

/** Preenchimento mínimo válido, como sai do formulário do admin. */
function formulario(sobrescreve: Record<string, unknown> = {}) {
  return {
    marca: "Honda",
    modelo: "Civic",
    versao: "",
    ano_fabricacao: 2019,
    ano_modelo: 2020,
    carroceria: null,
    cor: "",
    final_placa: "",
    km: 45000,
    cambio: null,
    combustivel: null,
    motor: "",
    portas: "",
    preco: 98900,
    preco_fipe: "",
    aceita_troca: false,
    aceita_financiamento: true,
    unico_dono: false,
    ipva_pago: false,
    licenciado: false,
    revisoes_concessionaria: false,
    laudo_cautelar: false,
    garantia_fabrica: false,
    opcionais: [],
    descricao: "",
    status: "disponivel",
    destaque: false,
    ...sobrescreve,
  };
}

describe("veiculoSchema", () => {
  it("aceita o preenchimento mínimo", () => {
    expect(veiculoSchema.safeParse(formulario()).success).toBe(true);
  });

  it("transforma texto vazio em null (o banco espera null, não \"\")", () => {
    const r = veiculoSchema.parse(formulario());
    expect(r.versao).toBeNull();
    expect(r.cor).toBeNull();
    expect(r.motor).toBeNull();
    expect(r.descricao).toBeNull();
    expect(r.preco_fipe).toBeNull();
    expect(r.portas).toBeNull();
    expect(r.final_placa).toBeNull();
  });

  it("converte números que vêm como string do input", () => {
    const r = veiculoSchema.parse(formulario({ km: "45000", preco: "98900", portas: "4" }));
    expect(r.km).toBe(45000);
    expect(r.preco).toBe(98900);
    expect(r.portas).toBe(4);
  });

  it("exige marca e modelo", () => {
    expect(veiculoSchema.safeParse(formulario({ marca: "  " })).success).toBe(false);
    expect(veiculoSchema.safeParse(formulario({ modelo: "" })).success).toBe(false);
  });

  it("recusa preço zerado ou negativo", () => {
    expect(veiculoSchema.safeParse(formulario({ preco: 0 })).success).toBe(false);
    expect(veiculoSchema.safeParse(formulario({ preco: -1 })).success).toBe(false);
  });

  it("recusa km negativo", () => {
    expect(veiculoSchema.safeParse(formulario({ km: -10 })).success).toBe(false);
  });

  it("recusa ano do modelo menor que o de fabricação", () => {
    const r = veiculoSchema.safeParse(formulario({ ano_fabricacao: 2021, ano_modelo: 2020 }));
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0].path).toEqual(["ano_modelo"]);
    }
  });

  it("aceita ano de fabricação igual ao do modelo", () => {
    const r = veiculoSchema.safeParse(formulario({ ano_fabricacao: 2021, ano_modelo: 2021 }));
    expect(r.success).toBe(true);
  });

  it("limita o final da placa a 0–9", () => {
    expect(veiculoSchema.safeParse(formulario({ final_placa: "10" })).success).toBe(false);
    expect(veiculoSchema.safeParse(formulario({ final_placa: "7" })).success).toBe(true);
  });

  it("limita portas a 1–6", () => {
    expect(veiculoSchema.safeParse(formulario({ portas: "8" })).success).toBe(false);
  });

  it("recusa status fora dos valores do enum", () => {
    expect(veiculoSchema.safeParse(formulario({ status: "vendido-quase" })).success).toBe(
      false,
    );
  });
});

describe("configuracoesSchema", () => {
  it("exige nome da loja e WhatsApp", () => {
    expect(configuracoesSchema.safeParse({ nome_loja: "", whatsapp: "11999999999" }).success).toBe(
      false,
    );
  });

  it("recusa número de WhatsApp incompleto", () => {
    const r = configuracoesSchema.safeParse({ nome_loja: "Loja", whatsapp: "9999" });
    expect(r.success).toBe(false);
  });

  it("aceita número com máscara", () => {
    const r = configuracoesSchema.safeParse({
      nome_loja: "Minha Revenda",
      whatsapp: "+55 (11) 99999-9999",
      endereco: "",
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.endereco).toBeNull();
  });
});
