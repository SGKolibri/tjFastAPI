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

// src/modules/obra/obra.schema.ts
var obra_schema_exports = {};
__export(obra_schema_exports, {
  $ref: () => $ref,
  obraSchemas: () => obraSchemas
});
module.exports = __toCommonJS(obra_schema_exports);
var import_zod = require("zod");
var import_fastify_zod = require("fastify-zod");
var obraSchema = import_zod.z.object({
  nome: import_zod.z.string(),
  cliente: import_zod.z.string(),
  valor: import_zod.z.number().optional(),
  dataInicio: import_zod.z.string().optional(),
  dataFim: import_zod.z.string().optional(),
  status: import_zod.z.string().optional(),
  funcionarioIds: import_zod.z.array(import_zod.z.string()).optional()
});
var CreateObraSchema = import_zod.z.object({
  nome: import_zod.z.string({
    required_error: "Nome is required",
    invalid_type_error: "Nome must be a string"
  }),
  cliente: import_zod.z.string({
    required_error: "Cliente is required",
    invalid_type_error: "Cliente must be a string"
  }),
  valor: import_zod.z.number(),
  dataInicio: import_zod.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Data de in\xEDcio deve estar no formato AAAA-MM-DD (ex: 2025-05-01)"
  }).transform((date) => `${date}T00:00:00Z`),
  dataFim: import_zod.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Data de fim deve estar no formato AAAA-MM-DD (ex: 2025-07-01)"
  }).transform((date) => `${date}T00:00:00Z`),
  status: import_zod.z.string(),
  funcionarioIds: import_zod.z.array(import_zod.z.string()).optional()
});
var { schemas: obraSchemas, $ref } = (0, import_fastify_zod.buildJsonSchemas)(
  {
    CreateObraSchema,
    obraSchema
  },
  {
    $id: "obraSchema"
  }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  $ref,
  obraSchemas
});
