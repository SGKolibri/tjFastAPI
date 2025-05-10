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

// src/modules/item/item.schema.ts
var item_schema_exports = {};
__export(item_schema_exports, {
  $ref: () => $ref,
  itemSchemas: () => itemSchemas
});
module.exports = __toCommonJS(item_schema_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  $ref,
  itemSchemas
});
