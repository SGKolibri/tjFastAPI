"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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

// src/modules/product/product.controller.ts
var product_controller_exports = {};
__export(product_controller_exports, {
  createProductHandler: () => createProductHandler,
  deleteProductByIdHandler: () => deleteProductByIdHandler,
  getProductByIdHandler: () => getProductByIdHandler,
  getProductsHandler: () => getProductsHandler
});
module.exports = __toCommonJS(product_controller_exports);

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

// src/modules/product/product.controller.ts
function createProductHandler(request, reply) {
  return __async(this, null, function* () {
    const body = request.body;
    try {
      const product = yield createProduct(__spreadProps(__spreadValues({}, body), { ownerId: request.user.id }));
      return reply.status(201).send(product);
    } catch (e) {
      console.log(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function getProductsHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const products = yield getProducts();
      return reply.send(products);
    } catch (e) {
      console.log(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function getProductByIdHandler(request, reply) {
  return __async(this, null, function* () {
    const { id } = request.params;
    try {
      const product = yield getProductById(Number(id));
      return reply.send(product);
    } catch (e) {
      console.log(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function deleteProductByIdHandler(request, reply) {
  return __async(this, null, function* () {
    const { id } = request.params;
    const product = yield getProductById(Number(id));
    if (!product) {
      return reply.status(404).send({ message: "Product not found" });
    }
    try {
      yield deleteProductById(Number(id));
      return reply.status(200).send({
        message: "Product deleted successfully",
        deletedProduct: product
      });
    } catch (e) {
      console.log(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createProductHandler,
  deleteProductByIdHandler,
  getProductByIdHandler,
  getProductsHandler
});
