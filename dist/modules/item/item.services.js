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

// src/modules/item/item.services.ts
var item_services_exports = {};
__export(item_services_exports, {
  assignItemToObra: () => assignItemToObra,
  createItem: () => createItem,
  deleteItem: () => deleteItem,
  getItemById: () => getItemById,
  getItems: () => getItems,
  getItemsByObra: () => getItemsByObra,
  getObrasByItem: () => getObrasByItem,
  removeItemFromObra: () => removeItemFromObra,
  updateItem: () => updateItem,
  updateItemInObra: () => updateItemInObra
});
module.exports = __toCommonJS(item_services_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assignItemToObra,
  createItem,
  deleteItem,
  getItemById,
  getItems,
  getItemsByObra,
  getObrasByItem,
  removeItemFromObra,
  updateItem,
  updateItemInObra
});
