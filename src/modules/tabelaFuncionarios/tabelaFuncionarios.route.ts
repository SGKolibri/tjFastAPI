import { FastifyInstance } from "fastify";
import {
  createTabelaFuncionarioHandler,
  getAllTabelasFuncionarioHandler,
} from "./tabelaFuncionarios.controller";

async function tabelaFuncionarioRoutes(server: FastifyInstance) {
  server.get(
    "/:mes/:ano",
    {
      preHandler: [server.authenticate],
    },
    createTabelaFuncionarioHandler
  );

  server.get(
    "/all",
    {
      preHandler: [server.authenticate],
    },
    getAllTabelasFuncionarioHandler
  );
}

export default tabelaFuncionarioRoutes;
