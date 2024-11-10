import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyJwt from "@fastify/jwt";
import { withRefResolver } from "fastify-zod";
import fastifyCors from "@fastify/cors";
import userRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";
import { productSchemas } from "./modules/product/product.schema";
import productRoutes from "./modules/product/product.route";
import { version } from "../package.json";

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
  for (const schema of [...userSchemas, ...productSchemas]) {
    server.addSchema(schema);
  }

  await server.register(require("@fastify/swagger"));
  await server.register(require("@fastify/swagger-ui"), {
    routePrefix: "/docs",
  });

  server.register(userRoutes, { prefix: "api/users" });
  server.register(productRoutes, { prefix: "api/products" });

  try {
    await server.listen({ port: 5050, host: "0.0.0.0" });
    console.log("Server started on http://localhost:5050");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
