import { FastifyInstance } from "fastify";
import {
  registerObraHandler,
  getObrasHandler,
  getObraByIdHandler,
  updateObraHandler,
  deleteObraHandler,
} from "./obra.controller";
import { $ref } from "./obra.schema";

async function obraRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("registerObraSchema"),
        response: {
          201: $ref("obraSchema"),
        },
      },
    },
    registerObraHandler
  );

  server.get(
    "/",
    {
      preHandler: [server.authenticate],
    },
    getObrasHandler
  );

  server.get(
    "/:id",
    {
      preHandler: [server.authenticate],
    },
    getObraByIdHandler
  );

  server.put(
    "/:id",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("obraSchema"),
        response: {
          200: $ref("obraSchema"),
        },
      },
    },
    updateObraHandler
  );

  server.delete(
    "/:id",
    {
      preHandler: [server.authenticate],
    },
    deleteObraHandler
  );
}

export default obraRoutes;
