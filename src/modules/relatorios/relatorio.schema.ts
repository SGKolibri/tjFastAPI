import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const relatorioRequestSchema = z.object({
  modulo: z.enum(["funcionario", "cargo", "item", "obra"]),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  formato: z.enum(["pdf", "excel", "json"]).default("pdf"),
  filtros: z.record(z.any()).optional(),
});

const relatorioResponseSchema = z.object({
  url: z.string(),
  geradoEm: z.string(),
  modulo: z.string(),
  formato: z.string(),
});

export type RelatorioRequest = z.infer<typeof relatorioRequestSchema>;
export type RelatorioResponse = z.infer<typeof relatorioResponseSchema>;

export const { schemas: relatorioSchemas, $ref } = buildJsonSchemas(
  {
    relatorioRequestSchema,
    relatorioResponseSchema,
  },
  { $id: "relatorioSchema" }
);
