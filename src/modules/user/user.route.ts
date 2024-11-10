import { FastifyInstance } from "fastify";
import {
  getUsersHandler,
  loginUserHandler,
  registerUserHandler,
  isUserAuthenticatedHandler,
  getUserByIdHandler,
} from "./user.controller";
import { $ref } from "./user.schema";

async function userRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("createUserSchema"),
        response: {
          201: $ref("createUserResponseSchema"),
        },
      },
    },
    registerUserHandler
  );

  server.get(
    "/is-authenticated",
    {
      preHandler: [server.authenticate],
    },
    isUserAuthenticatedHandler
  );

  server.post(
    "/login",
    {
      schema: {
        body: $ref("loginUserSchema"),
        response: {
          200: $ref("loginUserResponseSchema"),
        },
      },
    },
    loginUserHandler
  );

  server.get(
    "/",
    {
      preHandler: [server.authenticate],
    },
    getUsersHandler
  );

  server.get(
    "/:id",
    {
      preHandler: [server.authenticate],
    },
    getUserByIdHandler
  );
}

export default userRoutes;
