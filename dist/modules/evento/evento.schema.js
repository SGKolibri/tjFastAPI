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

// src/modules/evento/evento.schema.ts
var evento_schema_exports = {};
__export(evento_schema_exports, {
  $ref: () => $ref,
  eventoSchemas: () => eventoSchemas
});
module.exports = __toCommonJS(evento_schema_exports);
var import_zod = require("zod");
var import_fastify_zod = require("fastify-zod");
var CreateEventoSchema = import_zod.z.object({
  titulo: import_zod.z.string(),
  descricao: import_zod.z.string(),
  dataInicio: import_zod.z.string(),
  dataFim: import_zod.z.string(),
  allDay: import_zod.z.boolean()
});
var EventoResponseSchema = import_zod.z.object({
  id: import_zod.z.string(),
  titulo: import_zod.z.string(),
  descricao: import_zod.z.string(),
  dataInicio: import_zod.z.string(),
  dataFim: import_zod.z.string(),
  allDay: import_zod.z.boolean()
});
var { schemas: eventoSchemas, $ref } = (0, import_fastify_zod.buildJsonSchemas)(
  {
    CreateEventoSchema,
    EventoResponseSchema
  },
  { $id: "eventoSchema" }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  $ref,
  eventoSchemas
});
