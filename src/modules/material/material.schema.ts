import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const MaterialSchema = z.object({
  id: z.string().optional(),
  nome: z.string(),
  descricao: z.string().optional(),
  categoria: z.string(),
  unidade: z.string(),
  precoUnitario: z.number(),
  fornecedor: z.string().optional(),
  codigo: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const RegisterMaterialSchema = z.object({
  nome: z.string({
    required_error: "Nome is required",
    invalid_type_error: "Nome must be a string",
  }),
  descricao: z.string().optional(),
  categoria: z.string({
    required_error: "Categoria is required",
    invalid_type_error: "Categoria must be a string",
  }),
  unidade: z.string({
    required_error: "Unidade is required",
    invalid_type_error: "Unidade must be a string",
  }),
  precoUnitario: z.number({
    required_error: "Preço unitário is required",
    invalid_type_error: "Preço unitário must be a number",
  }),
  fornecedor: z.string().optional(),
  codigo: z.string().optional(),
});

// Schema for assigning material to an obra
const MaterialObraSchema = z.object({
  obraId: z.string({
    required_error: "Obra ID is required",
  }),
  materialId: z.string({
    required_error: "material ID is required",
  }),
  quantidade: z.number({
    required_error: "Quantidade is required",
  }),
  valorTotal: z.number().optional(),
  observacoes: z.string().optional(),
});

export type RegisterMaterialInput = z.infer<typeof RegisterMaterialSchema>;
export type MaterialInput = z.infer<typeof MaterialSchema>;
export type MaterialResponse = z.infer<typeof MaterialSchema>;
export type MaterialObraInput = z.infer<typeof MaterialObraSchema>;

export const { schemas: materialchemas, $ref } = buildJsonSchemas(
  {
    RegisterMaterialSchema,
    MaterialSchema,
    MaterialObraSchema,
  },
  {
    $id: "materialchema",
  }
);
