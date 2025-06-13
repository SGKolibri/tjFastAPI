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
  nome: z.string(),
  descricao: z.string().optional(),
  categoria: z.string(),
  unidade: z.string(),
  precoUnitario: z.number(),
  fornecedor: z.string().optional(),
  codigo: z.string().optional(),
  quantidade: z.number().optional(),
  status: z.string().optional(),
  localizacao: z.string().optional(),
  dataCompra: z.string().optional(), // Accepts ISO date string
  dataEntrega: z.string().optional(), // Accepts ISO date string
  numeroNota: z.string().optional(),
  projetos: z.array(z.string()).optional(), // Array of obra IDs
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
