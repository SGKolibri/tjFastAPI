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

// src/modules/cargo/cargo.schema.ts
var cargo_schema_exports = {};
__export(cargo_schema_exports, {
  $ref: () => $ref,
  cargoSchemas: () => cargoSchemas
});
module.exports = __toCommonJS(cargo_schema_exports);
var import_zod = require("zod");
var import_fastify_zod = require("fastify-zod");
var cargoSchema = import_zod.z.object({
  nome: import_zod.z.string()
});
var cargoResponseSchema = import_zod.z.object({
  id: import_zod.z.number(),
  nome: import_zod.z.string()
});
var { schemas: cargoSchemas, $ref } = (0, import_fastify_zod.buildJsonSchemas)(
  {
    cargoSchema,
    cargoResponseSchema
  },
  { $id: "cargoSchema" }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  $ref,
  cargoSchemas
});
