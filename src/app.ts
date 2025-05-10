import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyJwt from "@fastify/jwt";
import { withRefResolver } from "fastify-zod";
import fastifyCors from "@fastify/cors";
import funcionarioRoutes from "./modules/funcionario/funcionario.route";
import adminRoutes from "./modules/admin/admin.route";
import cargoRoutes from "./modules/cargo/cargo.route";
import tabelaFuncionarioRoutes from "./modules/tabelaFuncionarios/tabelaFuncionarios.route";
import eventoRoutes from "./modules/evento/evento.route";
import obraRoutes from "./modules/obra/obra.route";
import itemRoutes from "./modules/item/item.route";
import { adminSchemas } from "./modules/admin/admin.schemas";
import { funcionarioSchemas } from "./modules/funcionario/funcionario.schema";
import { cargoSchemas } from "./modules/cargo/cargo.schema";
import { tabelaFuncionarioSchemas } from "./modules/tabelaFuncionarios/tabelaFuncionarios.schema";
import { eventoSchemas } from "./modules/evento/evento.schema";
import { obraSchemas } from "./modules/obra/obra.schema";
import { itemSchemas } from "./modules/item/item.schema";

export const server = Fastify();

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      id: number;
      email: string;
      name: string;
    };
  }
}

server.register(fastifyCors, {
  origin: "*",
});

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}

server.register(fastifyJwt, {
  secret: jwtSecret,
});

server.decorate(
  "authenticate", // name of the decorator
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (e) {
      return reply.send(e);
    }
  }
);

server.get("/", async () => {
  return { healthcheck: "OK" };
});

async function main() {
  for (const schema of [
    ...funcionarioSchemas,
    ...adminSchemas,
    ...cargoSchemas,
    ...tabelaFuncionarioSchemas,
    ...obraSchemas,
    ...itemSchemas,
    ...eventoSchemas,
  ]) {
    server.addSchema(schema);
  }

  await server.register(require("@fastify/swagger"));
  await server.register(require("@fastify/swagger-ui"), {
    routePrefix: "/docs",
  });

  server.register(funcionarioRoutes, { prefix: "/api/func" });
  server.register(adminRoutes, { prefix: "/api/admin" });
  server.register(cargoRoutes, { prefix: "/api/cargo" });
  server.register(tabelaFuncionarioRoutes, { prefix: "/api/tabela" });
  server.register(eventoRoutes, { prefix: "/api/evento" });
  server.register(obraRoutes, { prefix: "/api/obra" });
  server.register(itemRoutes, { prefix: "/api/item" });

  console.log("Rebuilt at " + new Date().toLocaleString());
  console.log("Server started at " + new Date().toLocaleString());

  try {
    await server
      .listen({
        port: process.env.PORT ? Number(process.env.PORT) : 4567,
        host: "0.0.0.0",
      })
      .then(() => {
        console.log(
          `Server listening on ${
            process.env.PORT ? Number(process.env.PORT) : 4567
          }.`
        );
      });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
