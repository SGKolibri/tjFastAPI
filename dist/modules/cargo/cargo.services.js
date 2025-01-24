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

// src/modules/cargo/cargo.services.ts
var cargo_services_exports = {};
__export(cargo_services_exports, {
  createCargo: () => createCargo,
  createCargos: () => createCargos,
  getCargos: () => getCargos
});
module.exports = __toCommonJS(cargo_services_exports);

// src/utils/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var prisma_default = prisma;

// src/modules/cargo/cargo.services.ts
function createCargo(input) {
  return __async(this, null, function* () {
    const { nome } = input;
    const cargoExists = yield prisma_default.cargo.findFirst({
      where: {
        nome
      }
    });
    if (cargoExists) {
      throw new Error("Cargo j\xE1 existe no banco de dados");
    }
    const cargo = yield prisma_default.cargo.create({
      data: {
        nome
      }
    });
    return cargo;
  });
}
function createCargos(input) {
  return __async(this, null, function* () {
    console.log("1 - Input: ", input);
    const existingCargoNames = yield prisma_default.cargo.findMany({
      select: { nome: true }
    }).then((cargos2) => cargos2.map((cargo) => cargo.nome));
    console.log("2 - existingCargoNames: ", existingCargoNames);
    const cargosToCreate = input.filter(
      (cargo) => !existingCargoNames.includes(cargo.nome)
    );
    console.log("3 - cargosToCreate: ", cargosToCreate);
    const cargos = yield prisma_default.cargo.createMany({
      data: cargosToCreate
    });
    return cargos;
  });
}
function getCargos() {
  return __async(this, null, function* () {
    return yield prisma_default.cargo.findMany();
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createCargo,
  createCargos,
  getCargos
});
