// route handles the routing of the application

import { FastifyInstance } from "fastify";
import {
  createProductHandler,
  getProductsHandler,
  getProductByIdHandler,
  deleteProductByIdHandler,
} from "./product.controller";
import { $ref } from "./product.schema";

async function productRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("createProductSchema"),
        response: {
          201: $ref("productResponseSchema"),
        },
      },
    },
    createProductHandler
  );

  server.get(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        response: {
          200: $ref("productsResponseSchema"),
        },
      },
    },
    getProductsHandler
  );

  server.get(
    "/:id",
    {
      preHandler: [server.authenticate],
    },
    getProductByIdHandler
  );

  server.delete(
    "/:id",
    {
      preHandler: [server.authenticate],
    },
    deleteProductByIdHandler
  );
}

export default productRoutes;
