import { FastifyInstance } from "fastify";
import {
  getAdminsHandler,
  isAdminAuthenticatedHandler,
  loginAdminHandler,
  registerAdminHandler,
} from "./admin.controller";
import { $ref } from "./admin.schemas";

export default async function adminRoutes(server: FastifyInstance) {
  server.post("/", registerAdminHandler);
  server.get(
    "/",
    {
      preHandler: [server.authenticate],
    },
    getAdminsHandler
  );

  server.post(
    "/login",
    {
      schema: {
        body: $ref("loginAdminSchema"),
        response: {
          200: $ref("loginAdminResponseSchema"),
        },
      },
    },
    loginAdminHandler
  );

  server.get(
    "/is-authenticated",
    {
      preHandler: [server.authenticate],
    },
    isAdminAuthenticatedHandler
  );
}
