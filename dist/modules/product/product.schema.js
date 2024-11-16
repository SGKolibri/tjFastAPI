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

// src/modules/product/product.schema.ts
var product_schema_exports = {};
__export(product_schema_exports, {
  $ref: () => $ref,
  productSchemas: () => productSchemas
});
module.exports = __toCommonJS(product_schema_exports);
var import_zod = require("zod");
var import_fastify_zod = require("fastify-zod");
var productInput = {
  title: import_zod.z.string(),
  content: import_zod.z.string(),
  price: import_zod.z.number()
};
var productGenerated = {
  id: import_zod.z.number(),
  createdAt: import_zod.z.string(),
  updatedAt: import_zod.z.string()
};
var createProductSchema = import_zod.z.object({
  title: import_zod.z.string(),
  content: import_zod.z.string(),
  price: import_zod.z.number()
});
var productResponseSchema = import_zod.z.object(__spreadProps(__spreadValues(__spreadValues({}, productGenerated), productInput), {
  owner: import_zod.z.object({
    id: import_zod.z.number(),
    email: import_zod.z.string(),
    name: import_zod.z.string()
  })
}));
var productsResponseSchema = import_zod.z.array(productResponseSchema);
var { schemas: productSchemas, $ref } = (0, import_fastify_zod.buildJsonSchemas)(
  {
    createProductSchema,
    productResponseSchema,
    productsResponseSchema
  },
  { $id: "ProductSchema" }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  $ref,
  productSchemas
});
