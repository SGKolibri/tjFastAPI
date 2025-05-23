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
import { relatorioSchemas } from "./modules/relatorios/relatorio.schema";
import relatorioRoutes from "./modules/relatorios/relatorio.route";
import path from "path";
import { limparRelatoriosAntigos } from "./modules/relatorios/relatorio.services";

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
  "authenticate",
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
  await server.register(require("@fastify/static"), {
    root: path.join(__dirname, "../public/relatorios"),
    prefix: "/relatorios/",
    decorateReply: true,
    serve: true,
    setHeaders: (res: any, path: any) => {
      if (path.endsWith(".pdf")) {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline");
      }
    },
  });

  for (const schema of [
    ...funcionarioSchemas,
    ...adminSchemas,
    ...cargoSchemas,
    ...tabelaFuncionarioSchemas,
    ...obraSchemas,
    ...itemSchemas,
    ...eventoSchemas,
    ...relatorioSchemas,
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
  server.register(relatorioRoutes, { prefix: "/api/relatorio" });

  console.log("Rebuilt at " + new Date().toLocaleString());
  console.log("Server started at " + new Date().toLocaleString());

  try {
    await limparRelatoriosAntigos();
  } catch (error) {
    console.error("Erro na limpeza inicial de relatórios:", error);
  }

  // Configura limpeza periódica (a cada 24 horas = 86400000ms)
  setInterval(async () => {
    try {
      await limparRelatoriosAntigos();
    } catch (error) {
      console.error("Erro na limpeza periódica de relatórios:", error);
    }
  }, 86400000); // 24 horas, 86400000 = 24 * 60 * 60 * 1000

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
