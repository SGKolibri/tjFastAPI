import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { createFuncionarioSchema } from "../funcionario/funcionario.schema";

const tabelaFuncionarioSchema = z.object({
  funcionarios: z.array(createFuncionarioSchema),
  mes: z.number(),
  ano: z.number(),
  anomes: z.string(),
});

const createTabelaFuncionarioSchema = z.object({
  mes: z.number(),
  ano: z.number(),
  anomes: z.string(),
});

export type CreateTabelaFuncionarioInput = z.infer<
  typeof createTabelaFuncionarioSchema
>;

export const { schemas: tabelaFuncionarioSchemas, $ref } = buildJsonSchemas(
  {
    tabelaFuncionarioSchema,
    createTabelaFuncionarioSchema,
  },
  { $id: "tabelaFuncionariosSchema" }
);
