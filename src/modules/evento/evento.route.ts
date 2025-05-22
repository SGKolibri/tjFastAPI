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
    "/:eventoId",
    {
      preHandler: [server.authenticate],
    },
    deleteEventoHandler
  );

  server.put(
    "/:eventoId",
    {
      preHandler: [server.authenticate],
    },
    async (request, reply) => {
      return reply.status(501).send({ message: "Not Implemented" });
    }
  );
}
