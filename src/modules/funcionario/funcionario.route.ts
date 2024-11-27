import { FastifyInstance } from "fastify";
import {
  getFuncionariosHandler,
  // getFuncionariosHandler,
  // loginFuncionarioHandler,
  registerFuncionarioHandler,
  // isFuncionarioAuthenticatedHandler,
  getFuncionarioByIdHandler,
} from "./funcionario.controller";
import { $ref } from "./funcionario.schema";

async function funcionarioRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("createFuncionarioSchema"),
        response: {
          201: $ref("createFuncionarioResponseSchema"),
        },
      },
    },
    registerFuncionarioHandler
  );

  server.get(
    "/",
    {
      preHandler: [server.authenticate],
    },
    getFuncionariosHandler
  );

  server.get(
    "/:id",
    {
      preHandler: [server.authenticate],
    },
    getFuncionarioByIdHandler
  );
}

export default funcionarioRoutes;
