import { FastifyInstance } from "fastify";
import {
  assignItemToObraHandler,
  deleteItemHandler,
  getItemHandler,
  getItemsByObraHandler,
  getItemsHandler,
  getObrasByItemHandler,
  registerItemHandler,
  removeItemFromObraHandler,
  updateItemHandler,
  updateItemInObraHandler,
} from "./item.controller";
import { $ref } from "./item.schema";

async function itemRoutes(server: FastifyInstance) {
  // Item routes
  server.post(
    "/",
    {
      schema: {
        body: $ref("registerItemSchema"),
        response: {
          201: $ref("itemSchema"),
        },
      },
    },
    registerItemHandler
  );

  server.get(
    "/",
    {
      schema: {
        response: {
          200: {
            type: "array",
            items: $ref("itemSchema"),
          },
        },
      },
    },
    getItemsHandler
  );

  server.get(
    "/:id",
    {
      schema: {
        response: {
          200: $ref("itemSchema"),
        },
      },
    },
    getItemHandler
  );

  server.put(
    "/:id",
    {
      schema: {
        body: $ref("itemSchema"),
        response: {
          200: $ref("itemSchema"),
        },
      },
    },
    updateItemHandler
  );

  server.delete("/:id", deleteItemHandler);

  // Item-Obra relationship routes
  server.post(
    "/obra-assignment",
    {
      schema: {
        body: $ref("itemObraSchema"),
      },
    },
    assignItemToObraHandler
  );

  server.put("/obra-assignment/:id", updateItemInObraHandler);

  server.delete("/obra-assignment/:id", removeItemFromObraHandler);

  server.get("/obra/:obraId", getItemsByObraHandler);

  server.get("/:itemId/obras", getObrasByItemHandler);
}

export default itemRoutes;
