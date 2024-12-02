import prisma from "../../utils/prisma";
import {
  AddSalarioToFuncionarioInput,
  CreateFuncionarioInput,
} from "./funcionario.schema";
import { hashPassword } from "../../utils/hash";
import { create } from "domain";

export async function createFuncionario(input: CreateFuncionarioInput) {
  const { name, cargo, chavePix, banco, salarios, contato, cpf } = input;

  const funcionario = await prisma.funcionario.create({
    data: {
      name,
      cargo,
      chavePix,
      banco,
      cpf,
      contato,
      salarios: salarios
        ? {
            create: salarios.map((salario) => ({
              mes: salario.mes, // Substitua pelos campos reais
              ano: salario.ano, // Substitua pelos campos reais
              salarioBase: salario.salarioBase, // Substitua pelos campos reais
              horasExtras: salario.horasExtras ?? 0, // Valores opcionais com fallback
              descontos: salario.descontos ?? 0,
              bonus: salario.bonus ?? 0,
              faltas: salario.faltas ?? 0,
              extras: salario.extras ?? 0,
              beneficios: salario.beneficios
                ? {
                    create: {
                      cafe: salario.beneficios.cafe ?? 0,
                      almoco: salario.beneficios.almoco ?? 0,
                      passagem: salario.beneficios.passagem ?? 0,
                    },
                  }
                : undefined,
            })),
          }
        : undefined,
    },
  });

  return funcionario;
}

export async function findFuncionarios(search = "") {
  return await prisma.funcionario.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      cargo: true,
      chavePix: true,
      cpf: true,
      banco: true,
      contato: true,
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
              passagem: true,
            },
          },
        },
      },
    },
  });
}

export async function findFuncionarioById(id: string) {
  return await prisma.funcionario.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      cargo: true,
      chavePix: true,
      cpf: true,
      banco: true,
      contato: true,
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
              passagem: true,
            },
          },
        },
      },
    },
  });
}

export async function updateFuncionario(
  id: string,
  input: CreateFuncionarioInput
) {
  const { name, cargo, chavePix, banco, salarios, contato, cpf } = input;
  try {
    return await prisma.funcionario.update({
      where: { id },
      data: {
        name,
        cargo,
        chavePix,
        banco,
        cpf,
        contato,
        salarios: salarios
          ? {
              upsert: salarios.map((salario) => ({
                where: {
                  mes_ano_funcionarioId: {
                    mes: salario.mes,
                    ano: salario.ano,
                    funcionarioId: id,
                  },
                },
                update: {
                  mes: salario.mes, // Substitua pelos campos reais
                  ano: salario.ano, // Substitua pelos campos reais
                  salarioBase: salario.salarioBase, // Substitua pelos campos reais
                  horasExtras: salario.horasExtras ?? 0, // Valores opcionais com fallback
                  descontos: salario.descontos ?? 0,
                  bonus: salario.bonus ?? 0,
                  faltas: salario.faltas ?? 0,
                  extras: salario.extras ?? 0,
                  beneficios: salario.beneficios
                    ? {
                        upsert: {
                          update: {
                            cafe: salario.beneficios.cafe ?? 0,
                            almoco: salario.beneficios.almoco ?? 0,
                            passagem: salario.beneficios.passagem ?? 0,
                          },
                          create: {
                            cafe: salario.beneficios.cafe ?? 0,
                            almoco: salario.beneficios.almoco ?? 0,
                            passagem: salario.beneficios.passagem ?? 0,
                          },
                        },
                      }
                    : undefined,
                },
                create: {
                  mes: salario.mes, // Substitua pelos campos reais
                  ano: salario.ano, // Substitua pelos campos reais
                  salarioBase: salario.salarioBase, // Substitua pelos campos reais
                  horasExtras: salario.horasExtras ?? 0, // Valores opcionais com fallback
                  descontos: salario.descontos ?? 0,
                  bonus: salario.bonus ?? 0,
                  faltas: salario.faltas ?? 0,
                  extras: salario.extras ?? 0,
                  beneficios: salario.beneficios
                    ? {
                        create: {
                          cafe: salario.beneficios.cafe ?? 0,
                          almoco: salario.beneficios.almoco ?? 0,
                          passagem: salario.beneficios.passagem ?? 0,
                        },
                      }
                    : undefined,
                },
              })),
            }
          : undefined,
      },
    });
  } catch (e) {
    console.log(e);
  }
}

export async function addSalarioToFuncionario(
  funcionarioId: string,
  input: AddSalarioToFuncionarioInput
) {
  const { salario } = input;
  try {
    const funcionario = await prisma.funcionario.update({
      where: { id: funcionarioId },
      data: {
        salarios: {
          create: {
            mes: salario.mes,
            ano: salario.ano,
            salarioBase: salario.salarioBase,
            horasExtras: salario.horasExtras ?? 0,
            descontos: salario.descontos ?? 0,
            faltas: salario.faltas ?? 0,
            extras: salario.extras ?? 0,
            bonus: salario.bonus ?? 0,
            beneficios: salario.beneficios
              ? {
                  create: {
                    cafe: salario.beneficios.cafe ?? 0,
                    almoco: salario.beneficios.almoco ?? 0,
                    passagem: salario.beneficios.passagem ?? 0,
                  },
                }
              : undefined,
          },
        },
      },
      include: {
        salarios: true,
      },
    });

    return funcionario;
  } catch (e) {
    console.log(e);
  }
}

export async function deleteSalarioFromFuncionario(
  funcionarioId: string,
  salarioId: string
) {
  return await prisma.salarioMensal.delete({
    where: {
      id: salarioId,
      funcionarioId: funcionarioId,
    },
  });
}

export async function getSalarioFromFuncionario(
  funcionarioId: string,
  salarioId: string
) {
  return await prisma.salarioMensal.findUnique({
    where: {
      id: salarioId,
      funcionarioId: funcionarioId,
    },
  });
}
