import { FastifyInstance } from "fastify";
import {
  getAdminsHandler,
  isAdminAuthenticatedHandler,
  loginAdminHandler,
  registerAdminHandler,
} from "./admin.controller";
import { $ref } from "./admin.schemas";

export default async function adminRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
    },
    registerAdminHandler
  );
  server.get(
    "/",
    {
      preHandler: [server.authenticate],
    },
    getAdminsHandler
  );

  server.post("/login", loginAdminHandler);

  server.get(
    "/is-authenticated",
    {
      preHandler: [server.authenticate],
    },
    isAdminAuthenticatedHandler
  );
}
