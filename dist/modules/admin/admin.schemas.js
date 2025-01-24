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

// src/modules/admin/admin.schemas.ts
var admin_schemas_exports = {};
__export(admin_schemas_exports, {
  $ref: () => $ref,
  adminSchemas: () => adminSchemas
});
module.exports = __toCommonJS(admin_schemas_exports);
var import_zod = require("zod");
var import_fastify_zod = require("fastify-zod");
var creteAdminSchema = import_zod.z.object({
  email: import_zod.z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string"
  }).email(),
  password: import_zod.z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be at least 6 characters"
  }).min(6),
  name: import_zod.z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string"
  })
});
var createAdminResponseSchema = import_zod.z.object({
  id: import_zod.z.number(),
  email: import_zod.z.string(),
  name: import_zod.z.string()
});
var loginAdminSchema = import_zod.z.object({
  email: import_zod.z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string"
  }).email(),
  password: import_zod.z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string"
  })
});
var loginAdminResponseSchema = import_zod.z.object({
  accessToken: import_zod.z.string(),
  admin: import_zod.z.object({
    email: import_zod.z.string(),
    name: import_zod.z.string()
  })
});
var { schemas: adminSchemas, $ref } = (0, import_fastify_zod.buildJsonSchemas)(
  {
    creteAdminSchema,
    createAdminResponseSchema,
    loginAdminSchema,
    loginAdminResponseSchema
  },
  { $id: "AdminSchema" }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  $ref,
  adminSchemas
});
