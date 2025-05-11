"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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

// src/modules/admin/admin.route.ts
var admin_route_exports = {};
__export(admin_route_exports, {
  default: () => adminRoutes
});
module.exports = __toCommonJS(admin_route_exports);

// src/app.ts
var import_fastify = __toESM(require("fastify"));
var import_jwt = __toESM(require("@fastify/jwt"));
var import_cors = __toESM(require("@fastify/cors"));

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

// src/modules/funcionario/funcionario.controller.ts
function registerFuncionarioHandler(request, reply) {
  return __async(this, null, function* () {
    const body = request.body;
    try {
      const user = yield createFuncionario(body);
      return reply.status(201).send(user);
    } catch (e) {
      console.error(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function getFuncionariosHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const { search } = request.query;
      const funcionarios = yield findFuncionarios(search);
      return reply.status(201).send(funcionarios);
    } catch (e) {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function updateFuncionarioStatusHandler(request, reply) {
  return __async(this, null, function* () {
    const { id } = request.params;
    try {
      const updatedFuncionario = yield updateFuncionarioStatus(id);
      return reply.status(201).send(updatedFuncionario);
    } catch (e) {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function getFuncionarioByIdHandler(request, reply) {
  return __async(this, null, function* () {
    const { id } = request.params;
    try {
      const funcionario = yield findFuncionarioById(id);
      if (!funcionario) {
        return reply.status(404).send({ message: "Funcionario n\xE3o encontrado" });
      }
      return reply.status(201).send(funcionario);
    } catch (e) {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function registerManyFuncionariosAtOnceHandler(request, reply) {
  return __async(this, null, function* () {
    const funcionarios = request.body;
    try {
      const promises = funcionarios.map(
        (funcionario) => createFuncionario(funcionario)
      );
      const funcionariosCreated = yield Promise.all(promises);
      return reply.status(201).send(funcionariosCreated);
    } catch (e) {
      console.error(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function updateFuncionarioHandler(request, reply) {
  return __async(this, null, function* () {
    const { id } = request.params;
    const body = request.body;
    try {
      const updatedFuncionario = yield updateFuncionario(id, body);
      return reply.status(201).send(updatedFuncionario);
    } catch (e) {
      return reply.status(500).send({ message: "Could not update funcionario." });
    }
  });
}
function addSalarioToFuncionarioHandler(request, reply) {
  return __async(this, null, function* () {
    const { id } = request.params;
    const body = request.body;
    console.log("ID: ", id);
    console.log("BODY: ", body);
    const funcionario = yield findFuncionarioById(id);
    if (!funcionario) {
      return reply.status(404).send({ message: "Funcion\xE1rio n\xE3o encontrado." });
    }
    try {
      const funcionario2 = yield addSalarioToFuncionario(id, body);
      return reply.status(201).send({ status: 201, funcionario: funcionario2 });
    } catch (e) {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function AddSalariosToFuncionarioHandler(request, reply) {
  return __async(this, null, function* () {
    const { id } = request.params;
    const salarios = request.body;
    try {
      const funcionario = yield findFuncionarioById(id);
      if (!funcionario) {
        return reply.status(404).send({ message: "Funcion\xE1rio n\xE3o encontrado." });
      }
      const addedSalarios = yield addSalariosToFuncionario(id, salarios);
      return reply.status(201).send({ status: 201, salarios: addedSalarios });
    } catch (e) {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function deleteSalarioFromFuncionarioHandler(request, reply) {
  return __async(this, null, function* () {
    const { funcionarioId, salarioId } = request.params;
    const funcionario = yield findFuncionarioById(funcionarioId);
    if (!funcionario) {
      return reply.status(404).send({ message: "Funcion\xE1rio n\xE3o encontrado." });
    }
    const salario = yield getSalarioFromFuncionario(funcionarioId, salarioId);
    if (!salario) {
      return reply.status(404).send({ message: "Sal\xE1rio n\xE3o encontrado." });
    }
    try {
      const deletedSalario = deleteSalarioFromFuncionario(
        funcionarioId,
        salarioId
      );
      return reply.status(201).send({ message: "Sal\xE1rio deletado." });
    } catch (e) {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function getTotalFuncionariosHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const totalFuncionarios = yield getTotalFuncionarios();
      return reply.status(201).send({ totalFuncionarios });
    } catch (e) {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}

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
  salarios: import_zod.z.array(salarioSchema).optional(),
  obrasIds: import_zod.z.array(import_zod.z.string()).optional()
};
var addSalarioToFuncionarioSchema = import_zod.z.object({
  salario: salarioSchema
});
var createFuncionarioSchema = import_zod.z.object(__spreadValues({}, funcionarioCore));
var createFuncionarioResponseSchema = import_zod.z.object(__spreadValues({
  id: import_zod.z.string()
}, funcionarioCore));
var funcionarioResponseSchema = import_zod.z.object(__spreadValues({
  id: import_zod.z.string()
}, funcionarioCore));
var { schemas: funcionarioSchemas, $ref } = (0, import_fastify_zod.buildJsonSchemas)(
  {
    createFuncionarioSchema,
    createFuncionarioResponseSchema
  },
  { $id: "funcionarioSchema" }
);

// src/modules/funcionario/funcionario.route.ts
function funcionarioRoutes(server2) {
  return __async(this, null, function* () {
    server2.post(
      "/",
      {
        preHandler: [server2.authenticate],
        schema: {
          body: $ref("createFuncionarioSchema"),
          response: {
            201: $ref("createFuncionarioResponseSchema")
          }
        }
      },
      registerFuncionarioHandler
    );
    server2.post(
      "/many",
      {
        preHandler: [server2.authenticate]
      },
      registerManyFuncionariosAtOnceHandler
    );
    server2.post(
      "/:id/salario",
      {
        preHandler: [server2.authenticate]
      },
      addSalarioToFuncionarioHandler
    );
    server2.post(
      "/:id/salarios",
      {
        preHandler: [server2.authenticate]
      },
      AddSalariosToFuncionarioHandler
    );
    server2.get(
      "/",
      {
        preHandler: [server2.authenticate]
      },
      getFuncionariosHandler
    );
    server2.get(
      "/:id",
      {
        preHandler: [server2.authenticate]
      },
      getFuncionarioByIdHandler
    );
    server2.get(
      "/total",
      {
        preHandler: [server2.authenticate]
      },
      getTotalFuncionariosHandler
    );
    server2.patch(
      "/:id",
      {
        preHandler: [server2.authenticate]
      },
      updateFuncionarioHandler
    );
    server2.patch(
      "/status/:id",
      {
        preHandler: [server2.authenticate]
      },
      updateFuncionarioStatusHandler
    );
    server2.delete(
      "/:funcionarioId/salario/:salarioId",
      { preHandler: [server2.authenticate] },
      deleteSalarioFromFuncionarioHandler
    );
  });
}
var funcionario_route_default = funcionarioRoutes;

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
    const existingCargoNames = yield prisma_default.cargo.findMany({
      select: { nome: true }
    }).then((cargos2) => cargos2.map((cargo) => cargo.nome));
    const cargosToCreate = input.filter(
      (cargo) => !existingCargoNames.includes(cargo.nome)
    );
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

// src/modules/cargo/cargo.controller.ts
function createCargoHandler(request, reply) {
  return __async(this, null, function* () {
    const body = request.body;
    try {
      const cargo = yield createCargo(body);
      return reply.status(201).send(cargo);
    } catch (e) {
      console.error(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function createCargosFromJSONHandler(request, reply) {
  return __async(this, null, function* () {
    const body = request.body;
    try {
      const cargos = yield createCargos(body);
      return reply.status(201).send(cargos);
    } catch (e) {
      console.error(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function getCargosHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const cargos = yield getCargos();
      return reply.status(201).send(cargos);
    } catch (e) {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}

// src/modules/cargo/cargo.route.ts
function cargoRoutes(server2) {
  return __async(this, null, function* () {
    server2.post("/", { preHandler: [server2.authenticate] }, createCargoHandler);
    server2.post(
      "/json",
      { preHandler: [server2.authenticate] },
      createCargosFromJSONHandler
    );
    server2.get("/", { preHandler: [server2.authenticate] }, getCargosHandler);
  });
}
var cargo_route_default = cargoRoutes;

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

// src/modules/tabelaFuncionarios/tabelaFuncionarios.controller.ts
function createTabelaFuncionarioHandler(request, reply) {
  return __async(this, null, function* () {
    const { mes, ano } = request.params;
    const input = {
      mes: parseInt(mes, 10),
      ano: parseInt(ano, 10),
      anomes: `${ano}-${mes}`
    };
    try {
      const tabelaFuncionario = yield createTabelaFuncionario(input);
      return reply.status(201).send(tabelaFuncionario);
    } catch (error) {
      return reply.status(500).send({ message: "Internal Server Error", error });
    }
  });
}
function getAllTabelasFuncionarioHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const tabelasFuncionario = yield getAllTabelasFuncionario();
      return reply.send(tabelasFuncionario);
    } catch (error) {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}

// src/modules/tabelaFuncionarios/tabelaFuncionarios.route.ts
function tabelaFuncionarioRoutes(server2) {
  return __async(this, null, function* () {
    server2.get(
      "/:mes/:ano",
      {
        preHandler: [server2.authenticate]
      },
      createTabelaFuncionarioHandler
    );
    server2.get(
      "/all",
      {
        preHandler: [server2.authenticate]
      },
      getAllTabelasFuncionarioHandler
    );
  });
}
var tabelaFuncionarios_route_default = tabelaFuncionarioRoutes;

// src/modules/evento/evento.services.ts
function createEvento(input) {
  return __async(this, null, function* () {
    const { titulo, descricao, dataInicio, dataFim, allDay } = input;
    return prisma_default.evento.create({
      data: {
        titulo,
        descricao,
        dataInicio,
        dataFim,
        allDay
      }
    });
  });
}
function getEventos() {
  return __async(this, null, function* () {
    return prisma_default.evento.findMany({
      orderBy: {
        dataInicio: "asc"
      }
    });
  });
}
function deleteEvento(id) {
  return __async(this, null, function* () {
    return prisma_default.evento.delete({
      where: {
        id
      }
    });
  });
}

// src/modules/evento/evento.controller.ts
function createEventoHandler(request, reply) {
  return __async(this, null, function* () {
    const body = request.body;
    try {
      const evento = yield createEvento(body);
      return reply.status(201).send(evento);
    } catch (e) {
      console.error(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function getEventosHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const eventos = yield getEventos();
      return reply.status(200).send({ eventos });
    } catch (e) {
      console.error(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function deleteEventoHandler(request, reply) {
  return __async(this, null, function* () {
    console.log("Delete evento handler");
    const { eventoId } = request.params;
    console.log("ID do evento: ", eventoId);
    try {
      yield deleteEvento(eventoId);
      return reply.status(204).send({ message: "Evento deletado com sucesso" });
    } catch (e) {
      console.error(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}

// src/modules/evento/evento.route.ts
function eventoRoutes(server2) {
  return __async(this, null, function* () {
    server2.post(
      "/",
      {
        preHandler: [server2.authenticate]
      },
      createEventoHandler
    );
    server2.get(
      "/",
      {
        preHandler: [server2.authenticate]
      },
      getEventosHandler
    );
    server2.delete(
      "/:eventoId",
      {
        preHandler: [server2.authenticate]
      },
      deleteEventoHandler
    );
  });
}

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

// src/modules/obra/obra.controller.ts
function registerObraHandler(request, reply) {
  return __async(this, null, function* () {
    const body = request.body;
    try {
      const obra = yield createObra(body);
      return reply.status(201).send(obra);
    } catch (e) {
      console.error(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function getObrasHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const obras = yield getObras();
      return reply.status(200).send(obras);
    } catch (e) {
      console.error(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function getObraByIdHandler(request, reply) {
  return __async(this, null, function* () {
    const { id } = request.params;
    try {
      const obra = yield getObraById(id);
      if (!obra) {
        return reply.status(404).send({ message: "Obra not found" });
      }
      return reply.status(200).send(obra);
    } catch (e) {
      console.error(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function updateObraHandler(request, reply) {
  return __async(this, null, function* () {
    const { id } = request.params;
    const body = request.body;
    try {
      const obra = yield updateObra(id, body);
      return reply.status(200).send(obra);
    } catch (e) {
      console.error(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function deleteObraHandler(request, reply) {
  return __async(this, null, function* () {
    const { id } = request.params;
    try {
      const obra = yield deleteObra(id);
      return reply.status(200).send(obra);
    } catch (e) {
      console.error(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function registerMultipleObrasHandler(request, reply) {
  return __async(this, null, function* () {
    const bodies = request.body;
    const results = [];
    try {
      for (const body of bodies) {
        const obra = yield createObra(body);
        results.push(obra);
      }
      return reply.status(201).send(results);
    } catch (e) {
      console.error(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}

// src/modules/obra/obra.schema.ts
var import_zod2 = require("zod");
var import_fastify_zod2 = require("fastify-zod");
var obraSchema = import_zod2.z.object({
  nome: import_zod2.z.string(),
  cliente: import_zod2.z.string(),
  valor: import_zod2.z.number().optional(),
  dataInicio: import_zod2.z.string().optional(),
  dataFim: import_zod2.z.string().optional(),
  status: import_zod2.z.string().optional(),
  funcionarioIds: import_zod2.z.array(import_zod2.z.string()).optional()
});
var CreateObraSchema = import_zod2.z.object({
  nome: import_zod2.z.string({
    required_error: "Nome is required",
    invalid_type_error: "Nome must be a string"
  }),
  cliente: import_zod2.z.string({
    required_error: "Cliente is required",
    invalid_type_error: "Cliente must be a string"
  }),
  valor: import_zod2.z.number(),
  dataInicio: import_zod2.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Data de in\xEDcio deve estar no formato AAAA-MM-DD (ex: 2025-05-01)"
  }).transform((date) => `${date}T00:00:00Z`),
  dataFim: import_zod2.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Data de fim deve estar no formato AAAA-MM-DD (ex: 2025-07-01)"
  }).transform((date) => `${date}T00:00:00Z`),
  status: import_zod2.z.string(),
  funcionarioIds: import_zod2.z.array(import_zod2.z.string()).optional()
});
var { schemas: obraSchemas, $ref: $ref2 } = (0, import_fastify_zod2.buildJsonSchemas)(
  {
    CreateObraSchema,
    obraSchema
  },
  {
    $id: "obraSchema"
  }
);

// src/modules/obra/obra.route.ts
function obraRoutes(server2) {
  return __async(this, null, function* () {
    server2.post(
      "/",
      {
        preHandler: [server2.authenticate],
        schema: {
          body: $ref2("CreateObraSchema"),
          response: {
            201: $ref2("obraSchema")
          }
        }
      },
      registerObraHandler
    );
    server2.get(
      "/",
      {
        preHandler: [server2.authenticate]
      },
      getObrasHandler
    );
    server2.get(
      "/:id",
      {
        preHandler: [server2.authenticate]
      },
      getObraByIdHandler
    );
    server2.put(
      "/:id",
      {
        preHandler: [server2.authenticate],
        schema: {
          body: $ref2("obraSchema"),
          response: {
            200: $ref2("obraSchema")
          }
        }
      },
      updateObraHandler
    );
    server2.delete(
      "/:id",
      {
        preHandler: [server2.authenticate]
      },
      deleteObraHandler
    );
    server2.post(
      "/bulk",
      {
        preHandler: [server2.authenticate],
        schema: {
          body: {
            type: "array",
            items: $ref2("CreateObraSchema")
          },
          response: {
            201: {
              type: "array",
              items: $ref2("obraSchema")
            }
          }
        }
      },
      registerMultipleObrasHandler
    );
  });
}

// src/modules/item/item.services.ts
function createItem(input) {
  return __async(this, null, function* () {
    const item = yield prisma_default.item.create({
      data: __spreadValues({}, input)
    });
    return item;
  });
}
function getItems() {
  return __async(this, null, function* () {
    console.log("Fetching items...");
    return prisma_default.item.findMany({
      orderBy: {
        nome: "asc"
      }
    });
  });
}
function getItemById(id) {
  return __async(this, null, function* () {
    return prisma_default.item.findUnique({
      where: {
        id
      },
      include: {
        obras: {
          include: {
            obra: true
          }
        }
      }
    });
  });
}
function updateItem(id, data) {
  return __async(this, null, function* () {
    return prisma_default.item.update({
      where: {
        id
      },
      data
    });
  });
}
function deleteItem(id) {
  return __async(this, null, function* () {
    return prisma_default.item.delete({
      where: {
        id
      }
    });
  });
}
function assignItemToObra(input) {
  return __async(this, null, function* () {
    const { itemId, obraId, quantidade, valorTotal, observacoes } = input;
    let finalValorTotal = valorTotal;
    if (!valorTotal) {
      const item = yield prisma_default.item.findUnique({
        where: { id: itemId }
      });
      if (item) {
        finalValorTotal = item.precoUnitario * quantidade;
      }
    }
    return prisma_default.itemObra.create({
      data: {
        itemId,
        obraId,
        quantidade,
        valorTotal: finalValorTotal,
        observacoes
      },
      include: {
        item: true,
        obra: true
      }
    });
  });
}
function updateItemInObra(id, input) {
  return __async(this, null, function* () {
    const { quantidade } = input;
    let data = __spreadValues({}, input);
    if (quantidade) {
      const itemObra = yield prisma_default.itemObra.findUnique({
        where: { id },
        include: { item: true }
      });
      if (itemObra && itemObra.item) {
        data.valorTotal = itemObra.item.precoUnitario * quantidade;
      }
    }
    return prisma_default.itemObra.update({
      where: { id },
      data,
      include: {
        item: true,
        obra: true
      }
    });
  });
}
function removeItemFromObra(id) {
  return __async(this, null, function* () {
    return prisma_default.itemObra.delete({
      where: { id }
    });
  });
}
function getItemsByObra(obraId) {
  return __async(this, null, function* () {
    return prisma_default.itemObra.findMany({
      where: {
        obraId
      },
      include: {
        item: true
      },
      orderBy: {
        item: {
          nome: "asc"
        }
      }
    });
  });
}
function getObrasByItem(itemId) {
  return __async(this, null, function* () {
    return prisma_default.itemObra.findMany({
      where: {
        itemId
      },
      include: {
        obra: true
      },
      orderBy: {
        obra: {
          nome: "asc"
        }
      }
    });
  });
}

// src/modules/item/item.controller.ts
function registerItemHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const item = yield createItem(request.body);
      return reply.code(201).send(item);
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ message: "Error creating item" });
    }
  });
}
function getItemsHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const items = yield getItems();
      return reply.code(200).send(items);
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ message: "Error fetching items" });
    }
  });
}
function getItemHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const item = yield getItemById(request.params.id);
      if (!item) {
        return reply.code(404).send({ message: "Item not found" });
      }
      return reply.code(200).send(item);
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ message: "Error fetching item" });
    }
  });
}
function updateItemHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const item = yield updateItem(request.params.id, request.body);
      return reply.code(200).send(item);
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ message: "Error updating item" });
    }
  });
}
function deleteItemHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      yield deleteItem(request.params.id);
      return reply.code(204).send();
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ message: "Error deleting item" });
    }
  });
}
function assignItemToObraHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const itemObra = yield assignItemToObra(request.body);
      return reply.code(201).send(itemObra);
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ message: "Error assigning item to obra" });
    }
  });
}
function updateItemInObraHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const itemObra = yield updateItemInObra(
        request.params.id,
        request.body
      );
      return reply.code(200).send(itemObra);
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ message: "Error updating item in obra" });
    }
  });
}
function removeItemFromObraHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      yield removeItemFromObra(request.params.id);
      return reply.code(204).send();
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ message: "Error removing item from obra" });
    }
  });
}
function getItemsByObraHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const items = yield getItemsByObra(request.params.obraId);
      return reply.code(200).send(items);
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ message: "Error fetching items for obra" });
    }
  });
}
function getObrasByItemHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const obras = yield getObrasByItem(request.params.itemId);
      return reply.code(200).send(obras);
    } catch (e) {
      console.error(e);
      return reply.code(500).send({ message: "Error fetching obras for item" });
    }
  });
}

// src/modules/item/item.schema.ts
var import_zod3 = require("zod");
var import_fastify_zod3 = require("fastify-zod");
var itemSchema = import_zod3.z.object({
  id: import_zod3.z.string().optional(),
  nome: import_zod3.z.string(),
  descricao: import_zod3.z.string().optional(),
  categoria: import_zod3.z.string(),
  unidade: import_zod3.z.string(),
  precoUnitario: import_zod3.z.number(),
  fornecedor: import_zod3.z.string().optional(),
  codigo: import_zod3.z.string().optional(),
  createdAt: import_zod3.z.date().optional(),
  updatedAt: import_zod3.z.date().optional()
});
var registerItemSchema = import_zod3.z.object({
  nome: import_zod3.z.string({
    required_error: "Nome is required",
    invalid_type_error: "Nome must be a string"
  }),
  descricao: import_zod3.z.string().optional(),
  categoria: import_zod3.z.string({
    required_error: "Categoria is required",
    invalid_type_error: "Categoria must be a string"
  }),
  unidade: import_zod3.z.string({
    required_error: "Unidade is required",
    invalid_type_error: "Unidade must be a string"
  }),
  precoUnitario: import_zod3.z.number({
    required_error: "Pre\xE7o unit\xE1rio is required",
    invalid_type_error: "Pre\xE7o unit\xE1rio must be a number"
  }),
  fornecedor: import_zod3.z.string().optional(),
  codigo: import_zod3.z.string().optional()
});
var itemObraSchema = import_zod3.z.object({
  obraId: import_zod3.z.string({
    required_error: "Obra ID is required"
  }),
  itemId: import_zod3.z.string({
    required_error: "Item ID is required"
  }),
  quantidade: import_zod3.z.number({
    required_error: "Quantidade is required"
  }),
  valorTotal: import_zod3.z.number().optional(),
  observacoes: import_zod3.z.string().optional()
});
var { schemas: itemSchemas, $ref: $ref3 } = (0, import_fastify_zod3.buildJsonSchemas)(
  {
    registerItemSchema,
    itemSchema,
    itemObraSchema
  },
  {
    $id: "itemSchema"
  }
);

// src/modules/item/item.route.ts
function itemRoutes(server2) {
  return __async(this, null, function* () {
    server2.post(
      "/",
      {
        schema: {
          body: $ref3("registerItemSchema"),
          response: {
            201: $ref3("itemSchema")
          }
        }
      },
      registerItemHandler
    );
    server2.get(
      "/",
      {
        schema: {
          response: {
            200: {
              type: "array",
              items: $ref3("itemSchema")
            }
          }
        }
      },
      getItemsHandler
    );
    server2.get(
      "/:id",
      {
        schema: {
          response: {
            200: $ref3("itemSchema")
          }
        }
      },
      getItemHandler
    );
    server2.put(
      "/:id",
      {
        schema: {
          body: $ref3("itemSchema"),
          response: {
            200: $ref3("itemSchema")
          }
        }
      },
      updateItemHandler
    );
    server2.delete("/:id", deleteItemHandler);
    server2.post(
      "/obra-assignment",
      {
        schema: {
          body: $ref3("itemObraSchema")
        }
      },
      assignItemToObraHandler
    );
    server2.put("/obra-assignment/:id", updateItemInObraHandler);
    server2.delete("/obra-assignment/:id", removeItemFromObraHandler);
    server2.get("/obra/:obraId", getItemsByObraHandler);
    server2.get("/:itemId/obras", getObrasByItemHandler);
  });
}
var item_route_default = itemRoutes;

// src/modules/admin/admin.schemas.ts
var import_zod4 = require("zod");
var import_fastify_zod4 = require("fastify-zod");
var creteAdminSchema = import_zod4.z.object({
  email: import_zod4.z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string"
  }).email(),
  password: import_zod4.z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be at least 6 characters"
  }).min(6),
  name: import_zod4.z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string"
  })
});
var createAdminResponseSchema = import_zod4.z.object({
  id: import_zod4.z.number(),
  email: import_zod4.z.string(),
  name: import_zod4.z.string()
});
var loginAdminSchema = import_zod4.z.object({
  email: import_zod4.z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string"
  }).email(),
  password: import_zod4.z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string"
  })
});
var loginAdminResponseSchema = import_zod4.z.object({
  accessToken: import_zod4.z.string(),
  admin: import_zod4.z.object({
    email: import_zod4.z.string(),
    name: import_zod4.z.string()
  })
});
var { schemas: adminSchemas, $ref: $ref4 } = (0, import_fastify_zod4.buildJsonSchemas)(
  {
    creteAdminSchema,
    createAdminResponseSchema,
    loginAdminSchema,
    loginAdminResponseSchema
  },
  { $id: "AdminSchema" }
);

// src/modules/cargo/cargo.schema.ts
var import_zod5 = require("zod");
var import_fastify_zod5 = require("fastify-zod");
var cargoSchema2 = import_zod5.z.object({
  nome: import_zod5.z.string()
});
var cargoResponseSchema = import_zod5.z.object({
  id: import_zod5.z.string(),
  nome: import_zod5.z.string()
});
var { schemas: cargoSchemas, $ref: $ref5 } = (0, import_fastify_zod5.buildJsonSchemas)(
  {
    cargoSchema: cargoSchema2,
    cargoResponseSchema
  },
  { $id: "cargoSchema" }
);

// src/modules/tabelaFuncionarios/tabelaFuncionarios.schema.ts
var import_zod6 = require("zod");
var import_fastify_zod6 = require("fastify-zod");
var tabelaFuncionarioSchema = import_zod6.z.object({
  funcionarios: import_zod6.z.array(createFuncionarioSchema),
  mes: import_zod6.z.number(),
  ano: import_zod6.z.number(),
  anomes: import_zod6.z.string()
});
var createTabelaFuncionarioSchema = import_zod6.z.object({
  mes: import_zod6.z.number(),
  ano: import_zod6.z.number(),
  anomes: import_zod6.z.string()
});
var { schemas: tabelaFuncionarioSchemas, $ref: $ref6 } = (0, import_fastify_zod6.buildJsonSchemas)(
  {
    tabelaFuncionarioSchema,
    createTabelaFuncionarioSchema
  },
  { $id: "tabelaFuncionariosSchema" }
);

// src/modules/evento/evento.schema.ts
var import_zod7 = require("zod");
var import_fastify_zod7 = require("fastify-zod");
var CreateEventoSchema = import_zod7.z.object({
  titulo: import_zod7.z.string(),
  descricao: import_zod7.z.string(),
  dataInicio: import_zod7.z.string(),
  dataFim: import_zod7.z.string(),
  allDay: import_zod7.z.boolean()
});
var EventoResponseSchema = import_zod7.z.object({
  id: import_zod7.z.string(),
  titulo: import_zod7.z.string(),
  descricao: import_zod7.z.string(),
  dataInicio: import_zod7.z.string(),
  dataFim: import_zod7.z.string(),
  allDay: import_zod7.z.boolean()
});
var { schemas: eventoSchemas, $ref: $ref7 } = (0, import_fastify_zod7.buildJsonSchemas)(
  {
    CreateEventoSchema,
    EventoResponseSchema
  },
  { $id: "eventoSchema" }
);

// src/app.ts
var server = (0, import_fastify.default)();
server.register(import_cors.default, {
  origin: "*"
});
var jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}
server.register(import_jwt.default, {
  secret: jwtSecret
});
server.decorate(
  "authenticate",
  // name of the decorator
  (request, reply) => __async(void 0, null, function* () {
    try {
      yield request.jwtVerify();
    } catch (e) {
      return reply.send(e);
    }
  })
);
server.get("/", () => __async(void 0, null, function* () {
  return { healthcheck: "OK" };
}));
function main() {
  return __async(this, null, function* () {
    for (const schema of [
      ...funcionarioSchemas,
      ...adminSchemas,
      ...cargoSchemas,
      ...tabelaFuncionarioSchemas,
      ...obraSchemas,
      ...itemSchemas,
      ...eventoSchemas
    ]) {
      server.addSchema(schema);
    }
    yield server.register(require("@fastify/swagger"));
    yield server.register(require("@fastify/swagger-ui"), {
      routePrefix: "/docs"
    });
    server.register(funcionario_route_default, { prefix: "/api/func" });
    server.register(adminRoutes, { prefix: "/api/admin" });
    server.register(cargo_route_default, { prefix: "/api/cargo" });
    server.register(tabelaFuncionarios_route_default, { prefix: "/api/tabela" });
    server.register(eventoRoutes, { prefix: "/api/evento" });
    server.register(obraRoutes, { prefix: "/api/obra" });
    server.register(item_route_default, { prefix: "/api/item" });
    console.log("Rebuilt at " + (/* @__PURE__ */ new Date()).toLocaleString());
    console.log("Server started at " + (/* @__PURE__ */ new Date()).toLocaleString());
    try {
      yield server.listen({
        port: process.env.PORT ? Number(process.env.PORT) : 4567,
        host: "0.0.0.0"
      }).then(() => {
        console.log(
          `Server listening on ${process.env.PORT ? Number(process.env.PORT) : 4567}.`
        );
      });
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
}
main();

// src/utils/hash.ts
var import_crypto = __toESM(require("crypto"));
function hashPassword(password) {
  const salt = import_crypto.default.randomBytes(16).toString("hex");
  const hash = import_crypto.default.pbkdf2Sync(password, salt, 1e3, 64, "sha512").toString("hex");
  return { salt, hash };
}
function verifyPassword({
  candidatePassword,
  salt,
  hash
}) {
  const candidateHash = import_crypto.default.pbkdf2Sync(candidatePassword, salt, 1e3, 64, "sha512").toString("hex");
  return candidateHash === hash;
}

// src/modules/admin/admin.services.ts
function createAdmin(input) {
  return __async(this, null, function* () {
    const _a = input, { password } = _a, rest = __objRest(_a, ["password"]);
    const { hash, salt } = hashPassword(password);
    const admin = yield prisma_default.admin.create({
      data: __spreadProps(__spreadValues({}, rest), { salt, password: hash })
    });
    return admin;
  });
}
function findAdmins() {
  return __async(this, null, function* () {
    return prisma_default.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true
      }
    });
  });
}
function findAdminByEmail(email) {
  return __async(this, null, function* () {
    return prisma_default.admin.findUnique({
      where: { email }
    });
  });
}

// src/modules/admin/admin.controller.ts
function registerAdminHandler(request, reply) {
  return __async(this, null, function* () {
    const body = request.body;
    try {
      const admin = yield createAdmin(body);
      return reply.status(201).send(admin);
    } catch (e) {
      console.error(e);
      return reply.status(500).send({ message: "Erro ao registrar admin" });
    }
  });
}
function loginAdminHandler(request, reply) {
  return __async(this, null, function* () {
    const body = request.body;
    const admin = yield findAdminByEmail(body.email);
    if (!admin)
      return reply.code(401).send({ message: "Invalid email or password" });
    const correctPassword = verifyPassword({
      candidatePassword: body.password,
      salt: admin.salt,
      hash: admin.password
    });
    console.log("Admin ID:", typeof admin.id, admin.id);
    if (correctPassword) {
      const payload = {
        id: admin.id,
        // Explicitly include only the fields you need
        email: admin.email
      };
      const accessToken = server.jwt.sign(payload, { expiresIn: "1h" });
      return reply.send({
        accessToken,
        admin: { id: admin.id, email: admin.email, name: admin.name }
      });
    }
    return reply.code(401).send({ message: "Invalid email or password" });
  });
}
function getAdminsHandler(request, reply) {
  return __async(this, null, function* () {
    const admins = yield findAdmins();
    return reply.send(admins);
  });
}
function isAdminAuthenticatedHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      return reply.status(200).send({ message: "Authenticated" });
    } catch (e) {
      console.error(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}

// src/modules/admin/admin.route.ts
function adminRoutes(server2) {
  return __async(this, null, function* () {
    server2.post(
      "/",
      {
        preHandler: [server2.authenticate]
      },
      registerAdminHandler
    );
    server2.get(
      "/",
      {
        preHandler: [server2.authenticate]
      },
      getAdminsHandler
    );
    server2.post("/login", loginAdminHandler);
    server2.get(
      "/is-authenticated",
      {
        preHandler: [server2.authenticate]
      },
      isAdminAuthenticatedHandler
    );
  });
}
