"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/modules/product/product.services.ts
var product_services_exports = {};
__export(product_services_exports, {
  createProduct: () => createProduct,
  deleteProductById: () => deleteProductById,
  getProductById: () => getProductById,
  getProducts: () => getProducts
});
module.exports = __toCommonJS(product_services_exports);

// src/utils/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var prisma_default = prisma;

// src/modules/product/product.services.ts
function createProduct(data) {
  return __async(this, null, function* () {
    return prisma_default.product.create({
      data,
      // include the owner information in the response
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });
  });
}
function getProducts() {
  return __async(this, null, function* () {
    return prisma_default.product.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        price: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });
  });
}
function getProductById(id) {
  return __async(this, null, function* () {
    return prisma_default.product.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        title: true,
        content: true,
        price: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });
  });
}
function deleteProductById(id) {
  return __async(this, null, function* () {
    return prisma_default.product.delete({
      where: {
        id
      }
    });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createProduct,
  deleteProductById,
  getProductById,
  getProducts
});
