import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyJwt from "@fastify/jwt";
import { withRefResolver } from "fastify-zod";
import fastifyCors from "@fastify/cors";
import funcionarioRoutes from "./modules/funcionario/funcionario.route";
import { funcionarioSchemas } from "./modules/funcionario/funcionario.schema";
import adminRoutes from "./modules/admin/admin.route";
import { version } from "../package.json";
import { adminSchemas } from "./modules/admin/admin.schemas";

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
  for (const schema of [...funcionarioSchemas, ...adminSchemas]) {
    server.addSchema(schema);
  }

  await server.register(require("@fastify/swagger"));
  await server.register(require("@fastify/swagger-ui"), {
    routePrefix: "/docs",
  });

  server.register(funcionarioRoutes, { prefix: "api/func" });
  server.register(adminRoutes, { prefix: "api/admin" });

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
