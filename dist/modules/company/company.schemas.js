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

// src/modules/company/company.schemas.ts
var company_schemas_exports = {};
__export(company_schemas_exports, {
  $ref: () => $ref,
  companySchemas: () => companySchemas
});
module.exports = __toCommonJS(company_schemas_exports);
var import_zod = require("zod");
var import_fastify_zod = require("fastify-zod");
var CreateCompanySchema = import_zod.z.object({
  name: import_zod.z.string(),
  works: import_zod.z.array(import_zod.z.string())
});
var { schemas: companySchemas, $ref } = (0, import_fastify_zod.buildJsonSchemas)(
  {
    CreateCompanySchema
  },
  { $id: "CompanySchema" }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  $ref,
  companySchemas
});
