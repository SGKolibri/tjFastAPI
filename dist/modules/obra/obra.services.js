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
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
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

// src/modules/obra/obra.services.ts
var obra_services_exports = {};
__export(obra_services_exports, {
  createObra: () => createObra,
  deleteObra: () => deleteObra,
  getObraById: () => getObraById,
  getObras: () => getObras,
  updateObra: () => updateObra
});
module.exports = __toCommonJS(obra_services_exports);

// src/utils/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var prisma_default = prisma;

// src/modules/obra/obra.services.ts
function createObra(data) {
  return __async(this, null, function* () {
    const _a = __spreadValues({}, data), { funcionarioIds } = _a, obraData = __objRest(_a, ["funcionarioIds"]);
    console.log("Funcionario IDs:", funcionarioIds);
    if (obraData.dataInicio) {
      obraData.dataInicio = formatDateToISO(obraData.dataInicio);
    }
    if (obraData.dataFim) {
      obraData.dataFim = formatDateToISO(obraData.dataFim);
    }
    const obra = yield prisma_default.obra.create({
      data: __spreadValues({}, obraData)
    });
    if (Array.isArray(funcionarioIds) && funcionarioIds.length > 0) {
      for (const funcionarioId of funcionarioIds) {
        yield prisma_default.funcionario.update({
          where: { id: funcionarioId },
          data: {
            obras: {
              connect: { id: obra.id }
            }
          }
        });
      }
    }
    const updatedObra = yield getObraById(obra.id);
    return updatedObra;
  });
}
function formatDateToISO(dateString) {
  if (dateString.includes("T")) {
    return dateString;
  }
  return `${dateString}T00:00:00Z`;
}
function getObraById(id) {
  return __async(this, null, function* () {
    const obra = yield prisma_default.obra.findUnique({
      where: { id }
    });
    const funcionarios = yield prisma_default.funcionario.findMany({
      where: {
        obras: {
          some: {
            id
          }
        }
      }
    });
    return obra ? __spreadProps(__spreadValues({}, obra), { funcionarios }) : null;
  });
}
function getObras() {
  return __async(this, null, function* () {
    const obras = yield prisma_default.obra.findMany();
    const obrasWithFuncionarios = yield Promise.all(
      obras.map((obra) => __async(this, null, function* () {
        const funcionarios = yield prisma_default.funcionario.findMany({
          where: {
            obras: {
              some: {
                id: obra.id
              }
            }
          }
        });
        return __spreadProps(__spreadValues({}, obra), { funcionarios });
      }))
    );
    return obrasWithFuncionarios;
  });
}
function updateObra(id, data) {
  return __async(this, null, function* () {
    const _a = __spreadValues({}, data), { funcionarioIds } = _a, updatedData = __objRest(_a, ["funcionarioIds"]);
    if (updatedData.dataInicio) {
      updatedData.dataInicio = formatDateToISO(updatedData.dataInicio);
    }
    if (updatedData.dataFim) {
      updatedData.dataFim = formatDateToISO(updatedData.dataFim);
    }
    const obra = yield prisma_default.obra.update({
      where: { id },
      data: __spreadValues({}, updatedData)
    });
    if (Array.isArray(funcionarioIds)) {
      const currentFuncionarios = yield prisma_default.funcionario.findMany({
        where: {
          obras: {
            some: {
              id
            }
          }
        }
      });
      for (const func of currentFuncionarios) {
        yield prisma_default.funcionario.update({
          where: { id: func.id },
          data: {
            obras: {
              disconnect: { id }
            }
          }
        });
      }
      for (const funcionarioId of funcionarioIds) {
        const funcionario = yield prisma_default.funcionario.findUnique({
          where: { id: funcionarioId }
        });
        if (funcionario) {
          yield prisma_default.funcionario.update({
            where: { id: funcionarioId },
            data: {
              obras: {
                connect: { id }
              }
            }
          });
        }
      }
    }
    const updatedObra = yield getObraById(id);
    return updatedObra;
  });
}
function deleteObra(id) {
  return __async(this, null, function* () {
    const funcionarios = yield prisma_default.funcionario.findMany({
      where: {
        obras: {
          some: {
            id
          }
        }
      }
    });
    for (const funcionario of funcionarios) {
      yield prisma_default.funcionario.update({
        where: { id: funcionario.id },
        data: {
          obras: {
            disconnect: { id }
          }
        }
      });
    }
    const obra = yield prisma_default.obra.delete({
      where: { id }
    });
    return __spreadProps(__spreadValues({}, obra), { funcionarios });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createObra,
  deleteObra,
  getObraById,
  getObras,
  updateObra
});
