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

// src/modules/relatorios/relatorio.schema.ts
var relatorio_schema_exports = {};
__export(relatorio_schema_exports, {
  $ref: () => $ref,
  relatorioSchemas: () => relatorioSchemas
});
module.exports = __toCommonJS(relatorio_schema_exports);
var import_zod = require("zod");
var import_fastify_zod = require("fastify-zod");
var relatorioRequestSchema = import_zod.z.object({
  modulo: import_zod.z.enum(["funcionario", "cargo", "item", "obra"]),
  dataInicio: import_zod.z.string().optional(),
  dataFim: import_zod.z.string().optional(),
  formato: import_zod.z.enum(["pdf", "excel", "json"]).default("pdf"),
  filtros: import_zod.z.record(import_zod.z.any()).optional()
});
var relatorioResponseSchema = import_zod.z.object({
  url: import_zod.z.string(),
  geradoEm: import_zod.z.string(),
  modulo: import_zod.z.string(),
  formato: import_zod.z.string()
});
var { schemas: relatorioSchemas, $ref } = (0, import_fastify_zod.buildJsonSchemas)(
  {
    relatorioRequestSchema,
    relatorioResponseSchema
  },
  { $id: "relatorioSchema" }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  $ref,
  relatorioSchemas
});
