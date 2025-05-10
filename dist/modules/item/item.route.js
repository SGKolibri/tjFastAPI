"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/modules/item/item.route.ts
var item_route_exports = {};
__export(item_route_exports, {
  default: () => item_route_default
});
module.exports = __toCommonJS(item_route_exports);

// src/utils/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var prisma_default = prisma;

// src/modules/item/item.services.ts
function createItem(input) {
  return __async(this, null, function* () {
    const item = yield prisma_default.item.create({
      data: __spreadValues({}, input)
    });
    return item;
  });
}
function getItems() {
  return __async(this, null, function* () {
    console.log("Fetching items...");
    return prisma_default.item.findMany({
      orderBy: {
        nome: "asc"
      }
    });
  });
}
function getItemById(id) {
  return __async(this, null, function* () {
    return prisma_default.item.findUnique({
      where: {
        id
      },
      include: {
        obras: {
          include: {
            obra: true
          }
        }
      }
    });
  });
}
function updateItem(id, data) {
  return __async(this, null, function* () {
    return prisma_default.item.update({
      where: {
        id
      },
      data
    });
  });
}
function deleteItem(id) {
  return __async(this, null, function* () {
    return prisma_default.item.delete({
      where: {
        id
      }
    });
  });
}
function assignItemToObra(input) {
  return __async(this, null, function* () {
    const { itemId, obraId, quantidade, valorTotal, observacoes } = input;
    let finalValorTotal = valorTotal;
    if (!valorTotal) {
      const item = yield prisma_default.item.findUnique({
        where: { id: itemId }
      });
      if (item) {
        finalValorTotal = item.precoUnitario * quantidade;
      }
    }
    return prisma_default.itemObra.create({
      data: {
        itemId,
        obraId,
        quantidade,
        valorTotal: finalValorTotal,
        observacoes
      },
      include: {
        item: true,
        obra: true
      }
    });
  });
}
function updateItemInObra(id, input) {
  return __async(this, null, function* () {
    const { quantidade } = input;
    let data = __spreadValues({}, input);
    if (quantidade) {
      const itemObra = yield prisma_default.itemObra.findUnique({
        where: { id },
        include: { item: true }
      });
      if (itemObra && itemObra.item) {
        data.valorTotal = itemObra.item.precoUnitario * quantidade;
      }
    }
    return prisma_default.itemObra.update({
      where: { id },
      data,
      include: {
        item: true,
        obra: true
      }
    });
  });
}
function removeItemFromObra(id) {
  return __async(this, null, function* () {
    return prisma_default.itemObra.delete({
      where: { id }
    });
  });
}
function getItemsByObra(obraId) {
  return __async(this, null, function* () {
    return prisma_default.itemObra.findMany({
      where: {
        obraId
      },
      include: {
        item: true
      },
      orderBy: {
        item: {
          nome: "asc"
        }
      }
    });
  });
}
function getObrasByItem(itemId) {
  return __async(this, null, function* () {
    return prisma_default.itemObra.findMany({
      where: {
        itemId
      },
      include: {
        obra: true
      },
      orderBy: {
        obra: {
          nome: "asc"
        }
      }
    });
  });
}

// src/modules/item/item.controller.ts
function registerItemHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const item = yield createItem(request.body);
      return reply.code(201).send(item);
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ message: "Error creating item" });
    }
  });
}
function getItemsHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const items = yield getItems();
      return reply.code(200).send(items);
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ message: "Error fetching items" });
    }
  });
}
function getItemHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const item = yield getItemById(request.params.id);
      if (!item) {
        return reply.code(404).send({ message: "Item not found" });
      }
      return reply.code(200).send(item);
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ message: "Error fetching item" });
    }
  });
}
function updateItemHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const item = yield updateItem(request.params.id, request.body);
      return reply.code(200).send(item);
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ message: "Error updating item" });
    }
  });
}
function deleteItemHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      yield deleteItem(request.params.id);
      return reply.code(204).send();
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ message: "Error deleting item" });
    }
  });
}
function assignItemToObraHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const itemObra = yield assignItemToObra(request.body);
      return reply.code(201).send(itemObra);
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ message: "Error assigning item to obra" });
    }
  });
}
function updateItemInObraHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const itemObra = yield updateItemInObra(
        request.params.id,
        request.body
      );
      return reply.code(200).send(itemObra);
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ message: "Error updating item in obra" });
    }
  });
}
function removeItemFromObraHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      yield removeItemFromObra(request.params.id);
      return reply.code(204).send();
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ message: "Error removing item from obra" });
    }
  });
}
function getItemsByObraHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const items = yield getItemsByObra(request.params.obraId);
      return reply.code(200).send(items);
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ message: "Error fetching items for obra" });
    }
  });
}
function getObrasByItemHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const obras = yield getObrasByItem(request.params.itemId);
      return reply.code(200).send(obras);
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ message: "Error fetching obras for item" });
    }
  });
}

// src/modules/item/item.schema.ts
var import_zod = require("zod");
var import_fastify_zod = require("fastify-zod");
var itemSchema = import_zod.z.object({
  id: import_zod.z.string().optional(),
  nome: import_zod.z.string(),
  descricao: import_zod.z.string().optional(),
  categoria: import_zod.z.string(),
  unidade: import_zod.z.string(),
  precoUnitario: import_zod.z.number(),
  fornecedor: import_zod.z.string().optional(),
  codigo: import_zod.z.string().optional(),
  createdAt: import_zod.z.date().optional(),
  updatedAt: import_zod.z.date().optional()
});
var registerItemSchema = import_zod.z.object({
  nome: import_zod.z.string({
    required_error: "Nome is required",
    invalid_type_error: "Nome must be a string"
  }),
  descricao: import_zod.z.string().optional(),
  categoria: import_zod.z.string({
    required_error: "Categoria is required",
    invalid_type_error: "Categoria must be a string"
  }),
  unidade: import_zod.z.string({
    required_error: "Unidade is required",
    invalid_type_error: "Unidade must be a string"
  }),
  precoUnitario: import_zod.z.number({
    required_error: "Pre\xE7o unit\xE1rio is required",
    invalid_type_error: "Pre\xE7o unit\xE1rio must be a number"
  }),
  fornecedor: import_zod.z.string().optional(),
  codigo: import_zod.z.string().optional()
});
var itemObraSchema = import_zod.z.object({
  obraId: import_zod.z.string({
    required_error: "Obra ID is required"
  }),
  itemId: import_zod.z.string({
    required_error: "Item ID is required"
  }),
  quantidade: import_zod.z.number({
    required_error: "Quantidade is required"
  }),
  valorTotal: import_zod.z.number().optional(),
  observacoes: import_zod.z.string().optional()
});
var { schemas: itemSchemas, $ref } = (0, import_fastify_zod.buildJsonSchemas)(
  {
    registerItemSchema,
    itemSchema,
    itemObraSchema
  },
  {
    $id: "itemSchema"
  }
);

// src/modules/item/item.route.ts
function itemRoutes(server) {
  return __async(this, null, function* () {
    server.post(
      "/",
      {
        schema: {
          body: $ref("registerItemSchema"),
          response: {
            201: $ref("itemSchema")
          }
        }
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
              items: $ref("itemSchema")
            }
          }
        }
      },
      getItemsHandler
    );
    server.get(
      "/:id",
      {
        schema: {
          response: {
            200: $ref("itemSchema")
          }
        }
      },
      getItemHandler
    );
    server.put(
      "/:id",
      {
        schema: {
          body: $ref("itemSchema"),
          response: {
            200: $ref("itemSchema")
          }
        }
      },
      updateItemHandler
    );
    server.delete("/:id", deleteItemHandler);
    server.post(
      "/obra-assignment",
      {
        schema: {
          body: $ref("itemObraSchema")
        }
      },
      assignItemToObraHandler
    );
    server.put("/obra-assignment/:id", updateItemInObraHandler);
    server.delete("/obra-assignment/:id", removeItemFromObraHandler);
    server.get("/obra/:obraId", getItemsByObraHandler);
    server.get("/:itemId/obras", getObrasByItemHandler);
  });
}
var item_route_default = itemRoutes;
