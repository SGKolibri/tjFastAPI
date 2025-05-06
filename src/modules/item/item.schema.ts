import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const itemSchema = z.object({
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

const registerItemSchema = z.object({
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

// Schema for assigning items to an obra
const itemObraSchema = z.object({
  obraId: z.string({
    required_error: "Obra ID is required",
  }),
  itemId: z.string({
    required_error: "Item ID is required",
  }),
  quantidade: z.number({
    required_error: "Quantidade is required",
  }),
  valorTotal: z.number().optional(),
  observacoes: z.string().optional(),
});

export type RegisterItemInput = z.infer<typeof registerItemSchema>;
export type ItemInput = z.infer<typeof itemSchema>;
export type ItemResponse = z.infer<typeof itemSchema>;
export type ItemObraInput = z.infer<typeof itemObraSchema>;

export const { schemas: itemSchemas, $ref } = buildJsonSchemas(
  {
    registerItemSchema,
    itemSchema,
    itemObraSchema,
  },
  {
    $id: "itemSchema",
  }
);
