import { z } from "zod";

const ANO_MAX = new Date().getFullYear() + 1;

/** Converte "" em null; usado nos campos opcionais de texto. */
const textoOpcional = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable();

/** Converte "" e NaN em null nos números opcionais. */
const numeroOpcional = z
  .union([z.number(), z.string()])
  .transform((v) => {
    if (typeof v === "number") return Number.isNaN(v) ? null : v;
    const limpo = v.trim();
    if (limpo === "") return null;
    const n = Number(limpo.replace(/\./g, "").replace(",", "."));
    return Number.isNaN(n) ? null : n;
  })
  .nullable();

export const veiculoSchema = z
  .object({
    marca: z.string().trim().min(1, "Informe a marca"),
    modelo: z.string().trim().min(1, "Informe o modelo"),
    versao: textoOpcional,
    ano_fabricacao: z.coerce
      .number()
      .int()
      .min(1950, "Ano inválido")
      .max(ANO_MAX, "Ano inválido"),
    ano_modelo: z.coerce
      .number()
      .int()
      .min(1950, "Ano inválido")
      .max(ANO_MAX, "Ano inválido"),
    carroceria: z
      .enum(["hatch", "sedan", "suv", "picape", "van", "coupe"])
      .nullable(),
    cor: textoOpcional,
    final_placa: numeroOpcional.refine(
      (v) => v === null || (Number.isInteger(v) && v >= 0 && v <= 9),
      "Final da placa vai de 0 a 9",
    ),

    km: z.coerce.number().int().min(0, "Km não pode ser negativo"),
    cambio: z.enum(["manual", "automatico", "automatizado", "cvt"]).nullable(),
    combustivel: z
      .enum(["flex", "gasolina", "etanol", "diesel", "hibrido", "eletrico"])
      .nullable(),
    motor: textoOpcional,
    portas: numeroOpcional.refine(
      (v) => v === null || (Number.isInteger(v) && v >= 1 && v <= 6),
      "Portas de 1 a 6",
    ),

    preco: z.coerce.number().positive("Informe o preço"),
    preco_fipe: numeroOpcional.refine(
      (v) => v === null || v >= 0,
      "Valor FIPE inválido",
    ),
    aceita_troca: z.boolean(),
    aceita_financiamento: z.boolean(),

    unico_dono: z.boolean(),
    ipva_pago: z.boolean(),
    licenciado: z.boolean(),
    revisoes_concessionaria: z.boolean(),
    laudo_cautelar: z.boolean(),
    garantia_fabrica: z.boolean(),

    opcionais: z.array(z.string()),
    descricao: textoOpcional,

    status: z.enum(["disponivel", "reservado", "vendido", "inativo"]),
    destaque: z.boolean(),
  })
  .refine((v) => v.ano_modelo >= v.ano_fabricacao, {
    message: "Ano do modelo não pode ser menor que o de fabricação",
    path: ["ano_modelo"],
  });

export type VeiculoFormValues = z.input<typeof veiculoSchema>;
export type VeiculoFormData = z.output<typeof veiculoSchema>;

export const configuracoesSchema = z.object({
  nome_loja: z.string().trim().min(1, "Informe o nome da loja"),
  whatsapp: z
    .string()
    .trim()
    .min(10, "Informe o número com DDD")
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Número incompleto"),
  endereco: textoOpcional,
  cidade: textoOpcional,
  horario: textoOpcional,
  instagram: textoOpcional,
});

export type ConfiguracoesFormValues = z.input<typeof configuracoesSchema>;
