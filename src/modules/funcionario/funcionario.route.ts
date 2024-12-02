import { FastifyInstance } from "fastify";
import {
  getFuncionariosHandler,
  // getFuncionariosHandler,
  // loginFuncionarioHandler,
  registerFuncionarioHandler,
  // isFuncionarioAuthenticatedHandler,
  getFuncionarioByIdHandler,
  updateFuncionarioHandler,
  addSalarioToFuncionarioHandler,
  deleteSalarioFromFuncionarioHandler,
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

  server.patch(
    "/:id",
    {
      preHandler: [server.authenticate],
    },
    updateFuncionarioHandler
  );

  // add salario to funcionario
  server.post(
    "/:id/salario",
    {
      preHandler: [server.authenticate],
    },
    addSalarioToFuncionarioHandler
  );

  server.delete(
    "/:funcionarioId/salario/:salarioId",
    { preHandler: [server.authenticate] },
    deleteSalarioFromFuncionarioHandler
  );
}

export default funcionarioRoutes;
