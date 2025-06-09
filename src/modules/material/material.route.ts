import { FastifyInstance } from "fastify";

import { $ref } from "./material.schema";
import {
  assignMaterialToObraHandler,
  deleteMaterialHandler,
  getMaterialHandler,
  getMaterialsByObraHandler,
  getMaterialsHandler,
  getObrasByMaterialHandler,
  registerMaterialHandler,
  removeMaterialFromObraHandler,
  updateMaterialHandler,
} from "./material.controller";
import { deleteMaterial, removeMaterialFromObra } from "./material.services";

async function itemRoutes(server: FastifyInstance) {
  // Item routes
  server.post(
    "/",
    {
      schema: {
        body: $ref("RegisterMaterialSchema"),
        response: {
          201: $ref("MaterialSchema"),
        },
      },
    },
    registerMaterialHandler
  );

  server.get(
    "/",
    {
      schema: {
        response: {
          200: {
            type: "array",
            items: $ref("MaterialSchema"),
          },
        },
      },
    },
    getMaterialsHandler
  );

  server.get(
    "/:id",
    {
      schema: {
        response: {
          200: $ref("MaterialSchema"),
        },
      },
    },
    getMaterialHandler
  );

  server.put(
    "/:id",
    {
      schema: {
        body: $ref("MaterialSchema"),
        response: {
          200: $ref("MaterialSchema"),
        },
      },
    },
    updateMaterialHandler
  );

  server.delete("/:id", deleteMaterialHandler);

  // Item-Obra relationship routes
  server.post(
    "/obra-assignment",
    {
      schema: {
        body: $ref("MaterialObraSchema"),
      },
    },
    assignMaterialToObraHandler
  );

  server.put("/obra-assignment/:id", updateMaterialHandler);

  server.delete("/obra-assignment/:id", removeMaterialFromObraHandler);

  server.get("/obra/:obraId", getMaterialsByObraHandler);

  server.get("/:itemId/obras", getObrasByMaterialHandler);
}

export default itemRoutes;
