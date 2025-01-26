import { FastifyInstance } from "fastify";
import {
  createEventoHandler,
  deleteEventoHandler,
  getEventosHandler,
} from "./evento.controller";

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

  server.delete(
    "/:id",
    {
      preHandler: [server.authenticate],
    },
    deleteEventoHandler
  );
}
