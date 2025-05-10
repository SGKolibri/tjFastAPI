import { FastifyInstance } from "fastify";
import {
  registerObraHandler,
  getObrasHandler,
  getObraByIdHandler,
  updateObraHandler,
  deleteObraHandler,
} from "./obra.controller";
import { $ref } from "./obra.schema";

export default async function obraRoutes(server: FastifyInstance) {
  console.log("Registering obra routes...");

  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("CreateObraSchema"),
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
      schema: {
        response: {
          200: {
            type: "array",
            items: $ref("obraSchema"),
          },
        },
      },
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
