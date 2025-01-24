import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const cargoSchema = z.object({
  nome: z.string(),
});

const cargoResponseSchema = z.object({
  id: z.number(),
  nome: z.string(),
});

export type CreateCargoInput = z.infer<typeof cargoSchema>;

export const { schemas: cargoSchemas, $ref } = buildJsonSchemas(
  {
    cargoSchema,
    cargoResponseSchema,
  },
  { $id: "cargoSchema" }
);
