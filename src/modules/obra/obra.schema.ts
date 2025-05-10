import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const obraSchema = z.object({
  nome: z.string(),
  cliente: z.string(),
  valor: z.number().optional(),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  status: z.string().optional(),
  funcionarioIds: z.array(z.string()).optional(),
});

const CreateObraSchema = z.object({
  nome: z.string({
    required_error: "Nome is required",
    invalid_type_error: "Nome must be a string",
  }),
  cliente: z.string({
    required_error: "Cliente is required",
    invalid_type_error: "Cliente must be a string",
  }),
  valor: z.number(),
  dataInicio: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message:
        "Data de início deve estar no formato AAAA-MM-DD (ex: 2025-05-01)",
    })
    .transform((date) => `${date}T00:00:00Z`),
  dataFim: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Data de fim deve estar no formato AAAA-MM-DD (ex: 2025-07-01)",
    })
    .transform((date) => `${date}T00:00:00Z`),
  status: z.string(),
  funcionarioIds: z.array(z.string()).optional(),
});

export type RegisterObraInput = z.infer<typeof CreateObraSchema>;
export type ObraInput = z.infer<typeof obraSchema>;
export type ObraResponse = z.infer<typeof obraSchema>;

export const { schemas: obraSchemas, $ref } = buildJsonSchemas(
  {
    CreateObraSchema,
    obraSchema,
  },
  {
    $id: "obraSchema",
  }
);
