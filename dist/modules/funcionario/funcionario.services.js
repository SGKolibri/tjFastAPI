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

// src/modules/funcionario/funcionario.services.ts
var funcionario_services_exports = {};
__export(funcionario_services_exports, {
  addFuncionarioToTabelaFuncionario: () => addFuncionarioToTabelaFuncionario,
  addSalarioToFuncionario: () => addSalarioToFuncionario,
  addSalariosToFuncionario: () => addSalariosToFuncionario,
  addUpdatedFuncionarioToTabelaFuncionario: () => addUpdatedFuncionarioToTabelaFuncionario,
  createFuncionario: () => createFuncionario,
  createFuncionariosFromJSON: () => createFuncionariosFromJSON,
  deleteSalarioFromFuncionario: () => deleteSalarioFromFuncionario,
  findFuncionarioById: () => findFuncionarioById,
  findFuncionarios: () => findFuncionarios,
  getSalarioFromFuncionario: () => getSalarioFromFuncionario,
  getTotalFuncionarios: () => getTotalFuncionarios,
  removeFuncionarioFromTabelaFuncionario: () => removeFuncionarioFromTabelaFuncionario,
  updateFuncionario: () => updateFuncionario,
  updateFuncionarioStatus: () => updateFuncionarioStatus
});
module.exports = __toCommonJS(funcionario_services_exports);

// src/utils/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var prisma_default = prisma;

// src/modules/funcionario/funcionario.services.ts
function createFuncionario(input) {
  return __async(this, null, function* () {
    const {
      name,
      cargo,
      chavePix,
      banco,
      salarios,
      contato,
      cpf,
      status,
      obrasIds
    } = input;
    if (!cargo || !cargo.nome) {
      throw new Error("Cargo \xE9 obrigat\xF3rio");
    }
    const cpfRegistered = yield prisma_default.funcionario.findFirst({
      where: {
        cpf
      }
    });
    if (cpfRegistered !== null) {
      console.log("CPF REGISTERED ERROR: ", cpfRegistered);
      throw new Error("CPF j\xE1 cadastrado");
    }
    const allCargos = yield prisma_default.cargo.findMany();
    console.log("ALL CARGOS: ", allCargos);
    const cargoExists = yield prisma_default.cargo.findUnique({
      where: { nome: cargo.nome }
    });
    if (!cargoExists) {
      console.log("CARGO DOES NOT EXIST: ", cargo.nome);
      yield prisma_default.cargo.create({
        data: {
          nome: cargo.nome
        }
      });
    } else {
      console.log("CARGO EXISTS: ", cargo.nome);
    }
    const funcionario = yield prisma_default.funcionario.create({
      data: __spreadProps(__spreadValues({
        name,
        cargo: {
          connectOrCreate: {
            where: { nome: cargo.nome },
            create: { nome: cargo.nome }
          }
        },
        chavePix,
        banco,
        cpf,
        contato,
        status
      }, obrasIds && obrasIds.length > 0 ? {
        obras: {
          connect: obrasIds.map((id) => ({ id }))
        }
      } : {}), {
        salarios: salarios ? {
          create: salarios.map((salario) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return {
              mes: salario.mes,
              ano: salario.ano,
              salarioBase: salario.salarioBase,
              horasExtras: (_a = salario.horasExtras) != null ? _a : 0,
              descontos: (_b = salario.descontos) != null ? _b : 0,
              bonus: (_c = salario.bonus) != null ? _c : 0,
              faltas: (_d = salario.faltas) != null ? _d : 0,
              extras: (_e = salario.extras) != null ? _e : 0,
              beneficios: salario.beneficios ? {
                create: {
                  cafe: (_f = salario.beneficios.cafe) != null ? _f : 0,
                  almoco: (_g = salario.beneficios.almoco) != null ? _g : 0,
                  passagem: (_h = salario.beneficios.passagem) != null ? _h : 0
                }
              } : void 0
            };
          })
        } : void 0
      })
    });
    if (salarios) {
      const salaries = salarios.map((salario) => ({
        mes: salario.mes,
        ano: salario.ano
      }));
      yield Promise.all(
        salaries.map(
          (salary) => addFuncionarioToTabelaFuncionario(
            funcionario.id,
            salary.mes,
            salary.ano
          )
        )
      );
    }
    return funcionario;
  });
}
function findFuncionarios(search = "") {
  return __async(this, null, function* () {
    return yield prisma_default.funcionario.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive"
        }
      },
      select: {
        id: true,
        name: true,
        cargo: true,
        chavePix: true,
        cpf: true,
        banco: true,
        contato: true,
        status: true,
        salarios: {
          select: {
            id: true,
            mes: true,
            ano: true,
            salarioBase: true,
            horasExtras: true,
            descontos: true,
            bonus: true,
            faltas: true,
            extras: true,
            beneficios: {
              select: {
                cafe: true,
                almoco: true,
                passagem: true
              }
            }
          }
        }
      }
    });
  });
}
function updateFuncionarioStatus(id) {
  return __async(this, null, function* () {
    if (!id || typeof id !== "number") {
      throw new Error("Invalid ID provided");
    }
    const funcionario = yield prisma_default.funcionario.findUnique({
      where: { id }
      // Ensure id is treated as a number
    });
    if (!funcionario) {
      throw new Error("Funcion\xE1rio n\xE3o encontrado");
    }
    console.log("FUNCIONARIO STATUS: ", funcionario.status);
    const status = funcionario.status ? false : true;
    try {
      return yield prisma_default.funcionario.update({
        where: { id },
        // Ensure id is treated as a number
        data: {
          status
        }
      });
    } catch (error) {
      console.error("Error updating funcionario status: ", error);
      throw new Error("Failed to update funcionario status");
    }
  });
}
function findFuncionarioById(id) {
  return __async(this, null, function* () {
    return yield prisma_default.funcionario.findUnique({
      where: { id },
      // Ensure id is treated as a number
      select: {
        id: true,
        name: true,
        cargo: true,
        chavePix: true,
        cpf: true,
        banco: true,
        contato: true,
        status: true,
        salarios: {
          select: {
            id: true,
            mes: true,
            ano: true,
            salarioBase: true,
            horasExtras: true,
            descontos: true,
            bonus: true,
            faltas: true,
            extras: true,
            beneficios: {
              select: {
                cafe: true,
                almoco: true,
                passagem: true
              }
            }
          }
        }
      }
    });
  });
}
function updateFuncionario(id, input) {
  return __async(this, null, function* () {
    const {
      name,
      cargo,
      chavePix,
      banco,
      salarios,
      contato,
      cpf,
      status,
      obrasIds
    } = input;
    if (!cargo || !cargo.nome) {
      throw new Error("Cargo \xE9 obrigat\xF3rio");
    }
    console.log("FUNCIONARIO: ", input);
    try {
      const currentFuncionario = yield prisma_default.funcionario.findUnique({
        where: { id }
      });
      const updatedFuncionario = yield prisma_default.funcionario.update({
        where: { id },
        data: __spreadProps(__spreadValues({
          name,
          cargo: {
            upsert: {
              create: {
                nome: cargo.nome
              },
              update: {
                nome: cargo.nome
              }
            }
          },
          chavePix,
          banco,
          cpf,
          contato,
          status
        }, obrasIds && obrasIds.length > 0 ? {
          obras: {
            connect: obrasIds.map((id2) => ({ id: id2 }))
          }
        } : {}), {
          salarios: salarios ? {
            upsert: salarios.map((salario) => {
              var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
              return {
                where: {
                  mes_ano_funcionarioId: {
                    mes: salario.mes,
                    ano: salario.ano,
                    funcionarioId: id
                  }
                },
                update: {
                  mes: salario.mes,
                  ano: salario.ano,
                  salarioBase: salario.salarioBase,
                  horasExtras: (_a = salario.horasExtras) != null ? _a : 0,
                  descontos: (_b = salario.descontos) != null ? _b : 0,
                  bonus: (_c = salario.bonus) != null ? _c : 0,
                  faltas: (_d = salario.faltas) != null ? _d : 0,
                  extras: (_e = salario.extras) != null ? _e : 0,
                  beneficios: salario.beneficios ? {
                    upsert: {
                      update: {
                        cafe: (_f = salario.beneficios.cafe) != null ? _f : 0,
                        almoco: (_g = salario.beneficios.almoco) != null ? _g : 0,
                        passagem: (_h = salario.beneficios.passagem) != null ? _h : 0
                      },
                      create: {
                        cafe: (_i = salario.beneficios.cafe) != null ? _i : 0,
                        almoco: (_j = salario.beneficios.almoco) != null ? _j : 0,
                        passagem: (_k = salario.beneficios.passagem) != null ? _k : 0
                      }
                    }
                  } : void 0
                },
                create: {
                  mes: salario.mes,
                  ano: salario.ano,
                  salarioBase: salario.salarioBase,
                  horasExtras: (_l = salario.horasExtras) != null ? _l : 0,
                  descontos: (_m = salario.descontos) != null ? _m : 0,
                  bonus: (_n = salario.bonus) != null ? _n : 0,
                  faltas: (_o = salario.faltas) != null ? _o : 0,
                  extras: (_p = salario.extras) != null ? _p : 0,
                  beneficios: salario.beneficios ? {
                    create: {
                      cafe: (_q = salario.beneficios.cafe) != null ? _q : 0,
                      almoco: (_r = salario.beneficios.almoco) != null ? _r : 0,
                      passagem: (_s = salario.beneficios.passagem) != null ? _s : 0
                    }
                  } : void 0
                }
              };
            })
          } : void 0
        })
      });
      if (salarios) {
        const salaries = salarios.map((salario) => ({
          mes: salario.mes,
          ano: salario.ano
        }));
        for (const salary of salaries) {
          yield addUpdatedFuncionarioToTabelaFuncionario(
            updatedFuncionario.id,
            salary.mes,
            salary.ano
          );
        }
      }
      return updatedFuncionario;
    } catch (e) {
      console.log(e);
    }
  });
}
function addSalarioToFuncionario(funcionarioId, input) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { salario } = input;
    try {
      const funcionario = yield prisma_default.funcionario.update({
        where: { id: funcionarioId },
        data: {
          salarios: {
            create: {
              mes: salario.mes,
              ano: salario.ano,
              salarioBase: salario.salarioBase,
              horasExtras: (_a = salario.horasExtras) != null ? _a : 0,
              descontos: (_b = salario.descontos) != null ? _b : 0,
              faltas: (_c = salario.faltas) != null ? _c : 0,
              extras: (_d = salario.extras) != null ? _d : 0,
              bonus: (_e = salario.bonus) != null ? _e : 0,
              beneficios: salario.beneficios ? {
                create: {
                  cafe: (_f = salario.beneficios.cafe) != null ? _f : 0,
                  almoco: (_g = salario.beneficios.almoco) != null ? _g : 0,
                  passagem: (_h = salario.beneficios.passagem) != null ? _h : 0
                }
              } : void 0
            }
          }
        },
        include: {
          salarios: true
        }
      });
      return funcionario;
    } catch (e) {
      console.log(e);
    }
  });
}
function deleteSalarioFromFuncionario(funcionarioId, salarioId) {
  return __async(this, null, function* () {
    return yield prisma_default.salarioMensal.delete({
      where: {
        id: salarioId,
        funcionarioId
      }
    });
  });
}
function getSalarioFromFuncionario(funcionarioId, salarioId) {
  return __async(this, null, function* () {
    return yield prisma_default.salarioMensal.findUnique({
      where: {
        id: salarioId,
        funcionarioId
      }
    });
  });
}
function getTotalFuncionarios() {
  return __async(this, null, function* () {
    return yield prisma_default.funcionario.count();
  });
}
function addFuncionarioToTabelaFuncionario(funcionarioId, mes, ano) {
  return __async(this, null, function* () {
    console.log("FUNCIONARIO ID: ", Number(funcionarioId));
    try {
      const funcionario = yield prisma_default.funcionario.findUnique({
        where: { id: funcionarioId }
      });
      if (!funcionario) {
        throw new Error("Funcion\xE1rio n\xE3o encontrado");
      }
      const tabelaFuncionario = yield prisma_default.tabelaFuncionarios.findFirst({
        where: {
          mes,
          ano
        }
      });
      if (!tabelaFuncionario) {
        throw new Error("Tabela de funcion\xE1rios n\xE3o encontrada");
      }
      yield prisma_default.tabelaFuncionarios.update({
        where: {
          id: tabelaFuncionario.id
        },
        data: {
          funcionarios: {
            connect: {
              id: funcionario.id
            }
          }
        }
      });
      return tabelaFuncionario;
    } catch (e) {
      console.log(e);
    }
  });
}
function addUpdatedFuncionarioToTabelaFuncionario(funcionarioId, mes, ano) {
  return __async(this, null, function* () {
    try {
      const funcionario = yield prisma_default.funcionario.findUnique({
        where: { id: funcionarioId }
      });
      if (!funcionario) {
        throw new Error("Funcion\xE1rio n\xE3o encontrado");
      }
      const tabelaFuncionario = yield prisma_default.tabelaFuncionarios.findFirst({
        where: {
          mes,
          ano
        }
      });
      if (!tabelaFuncionario) {
        throw new Error("Tabela de funcion\xE1rios n\xE3o encontrada");
      }
      yield prisma_default.tabelaFuncionarios.update({
        where: {
          id: tabelaFuncionario.id
        },
        data: {
          funcionarios: {
            connect: {
              id: funcionario.id
            }
          }
        }
      });
      return tabelaFuncionario;
    } catch (e) {
      console.log(e);
    }
  });
}
function removeFuncionarioFromTabelaFuncionario(funcionarioId, mes, ano) {
  return __async(this, null, function* () {
    try {
      const funcionario = yield prisma_default.funcionario.findUnique({
        where: { id: funcionarioId }
      });
      if (!funcionario) {
        throw new Error("Funcion\xE1rio n\xE3o encontrado");
      }
      const tabelaFuncionario = yield prisma_default.tabelaFuncionarios.findFirst({
        where: {
          mes,
          ano
        }
      });
      if (!tabelaFuncionario) {
        throw new Error("Tabela de funcion\xE1rios n\xE3o encontrada");
      }
      yield prisma_default.tabelaFuncionarios.update({
        where: {
          id: tabelaFuncionario.id
        },
        data: {
          funcionarios: {
            disconnect: {
              id: funcionario.id
            }
          }
        }
      });
      return tabelaFuncionario;
    } catch (e) {
      console.log(e);
    }
  });
}
function createFuncionariosFromJSON(funcionarios) {
  return __async(this, null, function* () {
    for (const funcionario of funcionarios) {
      yield createFuncionario(funcionario);
    }
  });
}
function addSalariosToFuncionario(funcionarioId, salarios) {
  return __async(this, null, function* () {
    console.log("SALARIOS: ", salarios);
    try {
      yield prisma_default.$transaction((prisma2) => __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        for (const salario of salarios) {
          yield prisma2.salarioMensal.create({
            data: {
              mes: salario.mes,
              // Access `mes` from `salario`
              ano: salario.ano,
              // Access `ano` from `salario`
              salarioBase: salario.salarioBase,
              // Access `salarioBase` from `salario`
              horasExtras: (_a = salario.horasExtras) != null ? _a : 0,
              descontos: (_b = salario.descontos) != null ? _b : 0,
              bonus: (_c = salario.bonus) != null ? _c : 0,
              faltas: (_d = salario.faltas) != null ? _d : 0,
              extras: (_e = salario.extras) != null ? _e : 0,
              beneficios: salario.beneficios ? {
                create: {
                  cafe: (_f = salario.beneficios.cafe) != null ? _f : 0,
                  almoco: (_g = salario.beneficios.almoco) != null ? _g : 0,
                  passagem: (_h = salario.beneficios.passagem) != null ? _h : 0
                }
              } : void 0,
              funcionario: {
                connect: {
                  id: funcionarioId
                }
              }
            }
          });
        }
      }));
      console.log("Sal\xE1rios adicionados com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar sal\xE1rios:", error);
      throw new Error("Falha ao adicionar sal\xE1rios");
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addFuncionarioToTabelaFuncionario,
  addSalarioToFuncionario,
  addSalariosToFuncionario,
  addUpdatedFuncionarioToTabelaFuncionario,
  createFuncionario,
  createFuncionariosFromJSON,
  deleteSalarioFromFuncionario,
  findFuncionarioById,
  findFuncionarios,
  getSalarioFromFuncionario,
  getTotalFuncionarios,
  removeFuncionarioFromTabelaFuncionario,
  updateFuncionario,
  updateFuncionarioStatus
});
