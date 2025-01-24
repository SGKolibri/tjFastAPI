"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
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

// src/modules/tabelaFuncionarios/tabelaFuncionarios.schema.ts
var tabelaFuncionarios_schema_exports = {};
__export(tabelaFuncionarios_schema_exports, {
  $ref: () => $ref2,
  tabelaFuncionarioSchemas: () => tabelaFuncionarioSchemas
});
module.exports = __toCommonJS(tabelaFuncionarios_schema_exports);
var import_zod2 = require("zod");
var import_fastify_zod2 = require("fastify-zod");

// src/modules/funcionario/funcionario.schema.ts
var import_zod = require("zod");
var import_fastify_zod = require("fastify-zod");
var beneficiosSchema = import_zod.z.object({
  cafe: import_zod.z.number().optional(),
  almoco: import_zod.z.number().optional(),
  passagem: import_zod.z.number().optional()
});
var salarioSchema = import_zod.z.object({
  mes: import_zod.z.number().min(1).max(12),
  // Validação para mês válido
  ano: import_zod.z.number().int().min(2e3).max(2100),
  // Validação para ano válido
  salarioBase: import_zod.z.number(),
  // Salário base
  horasExtras: import_zod.z.number().optional(),
  descontos: import_zod.z.number().optional(),
  faltas: import_zod.z.number().optional(),
  extras: import_zod.z.number().optional(),
  bonus: import_zod.z.number().optional(),
  beneficios: beneficiosSchema.optional()
});
var cargoSchema = import_zod.z.object({
  nome: import_zod.z.string()
});
var funcionarioCore = {
  name: import_zod.z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string"
  }),
  cargo: cargoSchema.optional(),
  chavePix: import_zod.z.string({
    required_error: "ChavePix is required",
    invalid_type_error: "ChavePix must be a string"
  }),
  banco: import_zod.z.string({
    required_error: "Banco is required",
    invalid_type_error: "Banco must be a string"
  }),
  contato: import_zod.z.string({
    required_error: "Contato is required",
    invalid_type_error: "Contato must be a string"
  }),
  cpf: import_zod.z.string({
    required_error: "CPF is required",
    invalid_type_error: "CPF must be a string"
  }),
  status: import_zod.z.boolean(),
  salarios: import_zod.z.array(salarioSchema).optional()
};
var addSalarioToFuncionarioSchema = import_zod.z.object({
  salario: salarioSchema
});
var createFuncionarioSchema = import_zod.z.object(__spreadValues({}, funcionarioCore));
var createFuncionarioResponseSchema = import_zod.z.object(__spreadValues({
  id: import_zod.z.number()
}, funcionarioCore));
var funcionarioResponseSchema = import_zod.z.object(__spreadValues({
  id: import_zod.z.number()
}, funcionarioCore));
var { schemas: funcionarioSchemas, $ref } = (0, import_fastify_zod.buildJsonSchemas)(
  {
    createFuncionarioSchema,
    createFuncionarioResponseSchema
  },
  { $id: "funcionarioSchema" }
);

// src/modules/tabelaFuncionarios/tabelaFuncionarios.schema.ts
var tabelaFuncionarioSchema = import_zod2.z.object({
  funcionarios: import_zod2.z.array(createFuncionarioSchema),
  mes: import_zod2.z.number(),
  ano: import_zod2.z.number(),
  anomes: import_zod2.z.string()
});
var createTabelaFuncionarioSchema = import_zod2.z.object({
  mes: import_zod2.z.number(),
  ano: import_zod2.z.number(),
  anomes: import_zod2.z.string()
});
var { schemas: tabelaFuncionarioSchemas, $ref: $ref2 } = (0, import_fastify_zod2.buildJsonSchemas)(
  {
    tabelaFuncionarioSchema,
    createTabelaFuncionarioSchema
  },
  { $id: "tabelaFuncionariosSchema" }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  $ref,
  tabelaFuncionarioSchemas
});
