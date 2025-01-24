import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const CreateEventoSchema = z.object({
  titulo: z.string(),
  descricao: z.string(),
  dataInicio: z.string(),
  dataFim: z.string(),
  allDay: z.boolean(),
});

const EventoResponseSchema = z.object({
  id: z.number(),
  titulo: z.string(),
  descricao: z.string(),
  dataInicio: z.string(),
  dataFim: z.string(),
  allDay: z.boolean(),
});

export type CreateEventoInput = z.infer<typeof CreateEventoSchema>;
export type ReturnEventoInput = z.infer<typeof EventoResponseSchema>;

export const { schemas: eventoSchemas, $ref } = buildJsonSchemas(
  {
    CreateEventoSchema,
    EventoResponseSchema,
  },
  { $id: "eventoSchema" }
);
