import { FastifyInstance } from "fastify";
import {
  getFuncionariosHandler,
  registerFuncionarioHandler,
  getFuncionarioByIdHandler,
  updateFuncionarioHandler,
  addSalarioToFuncionarioHandler,
  deleteSalarioFromFuncionarioHandler,
  getTotalFuncionariosHandler,
  updateFuncionarioStatusHandler,
  registerManyFuncionariosAtOnceHandler,
  AddSalariosToFuncionarioHandler,
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

  server.post(
    "/many",
    {
      preHandler: [server.authenticate],
    },
    registerManyFuncionariosAtOnceHandler
  );

  server.post(
    "/:id/salario",
    {
      preHandler: [server.authenticate],
    },
    addSalarioToFuncionarioHandler
  );

  server.post(
    "/:id/salarios",
    {
      preHandler: [server.authenticate],
    },
    AddSalariosToFuncionarioHandler
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

  server.get(
    "/total",
    {
      preHandler: [server.authenticate],
    },
    getTotalFuncionariosHandler
  );

  server.patch(
    "/:id",
    {
      preHandler: [server.authenticate],
    },
    updateFuncionarioHandler
  );

  server.patch(
    "/status/:id",
    {
      preHandler: [server.authenticate],
    },
    updateFuncionarioStatusHandler
  );

  server.delete(
    "/:funcionarioId/salario/:salarioId",
    { preHandler: [server.authenticate] },
    deleteSalarioFromFuncionarioHandler
  );
}

export default funcionarioRoutes;
