import { FastifyInstance } from "fastify";
import {
  createCargoHandler,
  createCargosFromJSONHandler,
  getCargosHandler,
} from "./cargo.controller";

async function cargoRoutes(server: FastifyInstance) {
  server.post("/", { preHandler: [server.authenticate] }, createCargoHandler);
  server.post(
    "/json",
    { preHandler: [server.authenticate] },
    createCargosFromJSONHandler
  );
  server.get("/", { preHandler: [server.authenticate] }, getCargosHandler);
}

export default cargoRoutes;
