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

// src/modules/tabelaFuncionarios/tabelaFuncionarios.services.ts
var tabelaFuncionarios_services_exports = {};
__export(tabelaFuncionarios_services_exports, {
  createTabelaFuncionario: () => createTabelaFuncionario,
  getAllTabelasFuncionario: () => getAllTabelasFuncionario,
  getTabelaFuncionarioByMonthAndYear: () => getTabelaFuncionarioByMonthAndYear
});
module.exports = __toCommonJS(tabelaFuncionarios_services_exports);

// src/utils/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var prisma_default = prisma;

// src/modules/tabelaFuncionarios/tabelaFuncionarios.services.ts
function createTabelaFuncionario(input) {
  return __async(this, null, function* () {
    console.log("ANO/MES", input.anomes);
    try {
      let existingTabela = yield prisma_default.tabelaFuncionarios.findFirst({
        where: {
          mes: input.mes,
          ano: input.ano
        },
        include: {
          funcionarios: {
            include: {
              cargo: true,
              salarios: {
                include: {
                  beneficios: true
                }
              }
            }
          }
        }
      });
      const funcionarios = yield prisma_default.funcionario.findMany({
        where: {
          NOT: {
            tabelaFuncionarios: {
              some: {
                mes: input.mes,
                ano: input.ano
              }
            }
          },
          salarios: {
            some: {
              mes: input.mes,
              ano: input.ano
            }
          }
        }
      });
      if (existingTabela) {
        const funcionariosIds = existingTabela.funcionarios.map(
          (funcionario) => funcionario.id
        );
        const funcionariosToAdd = funcionarios.filter(
          (funcionario) => !funcionariosIds.includes(funcionario.id)
        );
        if (funcionariosToAdd.length > 0) {
          yield prisma_default.tabelaFuncionarios.update({
            where: {
              id: existingTabela.id
            },
            data: {
              funcionarios: {
                connect: funcionariosToAdd.map((funcionario) => ({
                  id: funcionario.id
                }))
              }
            }
          });
        }
        return getTabelaFuncionarioByMonthAndYear(input.mes, input.ano);
      }
      yield prisma_default.tabelaFuncionarios.create({
        data: {
          ano: input.ano,
          mes: input.mes,
          anomes: input.anomes,
          funcionarios: {
            connect: funcionarios.map((funcionario) => ({
              id: funcionario.id
            }))
          }
        }
      });
      return getTabelaFuncionarioByMonthAndYear(input.mes, input.ano);
    } catch (e) {
      console.log(e);
    }
  });
}
function getTabelaFuncionarioByMonthAndYear(month, year) {
  return __async(this, null, function* () {
    try {
      const tabela = yield prisma_default.tabelaFuncionarios.findFirst({
        where: {
          mes: month,
          ano: year
        },
        include: {
          funcionarios: {
            include: {
              cargo: true,
              salarios: {
                include: {
                  beneficios: true
                }
              }
            }
          }
        }
      });
      return tabela;
    } catch (e) {
      console.log(e);
    }
  });
}
function getAllTabelasFuncionario() {
  return __async(this, null, function* () {
    return prisma_default.tabelaFuncionarios.findMany({
      include: {
        funcionarios: true
      }
    });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createTabelaFuncionario,
  getAllTabelasFuncionario,
  getTabelaFuncionarioByMonthAndYear
});
