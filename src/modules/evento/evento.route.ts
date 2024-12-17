import { FastifyInstance } from "fastify";
import { createEventoHandler, getEventosHandler } from "./evento.controller";

export default async function eventoRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
    },
    createEventoHandler
  );

  server.get(
    "/",
    {
      preHandler: [server.authenticate],
    },
    getEventosHandler
  );
}
