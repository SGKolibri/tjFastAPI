import prisma from "../../utils/prisma";
import {
  AddSalariosToFuncionarioInput,
  AddSalarioToFuncionarioInput,
  CreateFuncionarioInput,
} from "./funcionario.schema";

export async function createFuncionario(input: CreateFuncionarioInput) {
  const {
    name,
    cargo,
    chavePix,
    banco,
    salarios,
    contato,
    cpf,
    status,
    obrasIds,
  } = input;

  if (!cargo || !cargo.nome) {
    throw new Error("Cargo é obrigatório");
  }

  const cpfRegistered = await prisma.funcionario.findFirst({
    where: {
      cpf: cpf,
    },
  });

  if (cpfRegistered !== null) {
    console.log("CPF REGISTERED ERROR: ", cpfRegistered);
    throw new Error("CPF já cadastrado");
  }

  const allCargos = await prisma.cargo.findMany();
  console.log("ALL CARGOS: ", allCargos);

  // check if cargo exists in the database, if not, create it
  const cargoExists = await prisma.cargo.findUnique({
    where: { nome: cargo.nome },
  });

  if (!cargoExists) {
    console.log("CARGO DOES NOT EXIST: ", cargo.nome);
    await prisma.cargo.create({
      data: {
        nome: cargo.nome,
      },
    });
  } else {
    console.log("CARGO EXISTS: ", cargo.nome);
  }

  const funcionario = await prisma.funcionario.create({
    data: {
      name,
      cargo: {
        connectOrCreate: {
          where: { nome: cargo.nome },
          create: { nome: cargo.nome },
        },
      },
      chavePix,
      banco,
      cpf,
      contato,
      status,
      // Fix the obras connection to match the Prisma schema
      ...(obrasIds && obrasIds.length > 0
        ? {
            obras: {
              connect: obrasIds.map((id) => ({ id })),
            },
          }
        : {}),
      salarios: salarios
        ? {
            create: salarios.map((salario) => ({
              mes: salario.mes,
              ano: salario.ano,
              salarioBase: salario.salarioBase,
              horasExtras: salario.horasExtras ?? 0,
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

  // add funcionario to its respective tabelaFuncionarios
  if (salarios) {
    const salaries = salarios.map((salario) => ({
      mes: salario.mes,
      ano: salario.ano,
    }));

    await Promise.all(
      salaries.map((salary) =>
        addFuncionarioToTabelaFuncionario(
          funcionario.id,
          salary.mes,
          salary.ano
        )
      )
    );
  }

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
              passagem: true,
            },
          },
        },
      },
    },
  });
}

export async function updateFuncionarioStatus(id: string) {
  if (!id || typeof id !== "number") {
    throw new Error("Invalid ID provided");
  }

  const funcionario = await prisma.funcionario.findUnique({
    where: { id }, // Ensure id is treated as a number
  });

  if (!funcionario) {
    throw new Error("Funcionário não encontrado");
  }
  console.log("FUNCIONARIO STATUS: ", funcionario.status);
  const status = funcionario.status ? false : true;

  try {
    return await prisma.funcionario.update({
      where: { id }, // Ensure id is treated as a number
      data: {
        status,
      },
    });
  } catch (error) {
    console.error("Error updating funcionario status: ", error);
    throw new Error("Failed to update funcionario status");
  }
}

export async function findFuncionarioById(id: string) {
  return await prisma.funcionario.findUnique({
    where: { id }, // Ensure id is treated as a number

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
  const {
    name,
    cargo,
    chavePix,
    banco,
    salarios,
    contato,
    cpf,
    status,
    obrasIds,
  } = input;

  if (!cargo || !cargo.nome) {
    throw new Error("Cargo é obrigatório");
  }

  console.log("FUNCIONARIO: ", input);

  try {
    // First, get the current funcionario to check existing obras relationships
    const currentFuncionario = await prisma.funcionario.findUnique({
      where: { id },
    });

    const updatedFuncionario = await prisma.funcionario.update({
      where: { id },
      data: {
        name,
        cargo: {
          upsert: {
            create: {
              nome: cargo.nome,
            },
            update: {
              nome: cargo.nome,
            },
          },
        },
        chavePix,
        banco,
        cpf,
        contato,
        status,
        obras: {
          connect: obrasIds?.map((obraId) => ({ id: obraId })),
        },
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
                  mes: salario.mes,
                  ano: salario.ano,
                  salarioBase: salario.salarioBase,
                  horasExtras: salario.horasExtras ?? 0,
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
                  mes: salario.mes,
                  ano: salario.ano,
                  salarioBase: salario.salarioBase,
                  horasExtras: salario.horasExtras ?? 0,
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

    if (salarios) {
      const salaries = salarios.map((salario) => ({
        mes: salario.mes,
        ano: salario.ano,
      }));

      for (const salary of salaries) {
        await addUpdatedFuncionarioToTabelaFuncionario(
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
      funcionarioId,
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
      funcionarioId,
    },
  });
}

export async function getTotalFuncionarios() {
  return await prisma.funcionario.count();
}

// Tabela Funcionarios is identified by month and year, and so is the funcionario salary
export async function addFuncionarioToTabelaFuncionario(
  funcionarioId: string,
  mes: number,
  ano: number
) {
  console.log("FUNCIONARIO ID: ", Number(funcionarioId));
  try {
    const funcionario = await prisma.funcionario.findUnique({
      where: { id: funcionarioId },
    });

    if (!funcionario) {
      throw new Error("Funcionário não encontrado");
    }

    const tabelaFuncionario = await prisma.tabelaFuncionarios.findFirst({
      where: {
        mes,
        ano,
      },
    });

    if (!tabelaFuncionario) {
      throw new Error("Tabela de funcionários não encontrada");
    }

    await prisma.tabelaFuncionarios.update({
      where: {
        id: tabelaFuncionario.id,
      },
      data: {
        funcionarios: {
          connect: {
            id: funcionario.id,
          },
        },
      },
    });

    return tabelaFuncionario;
  } catch (e) {
    console.log(e);
  }
}

export async function addUpdatedFuncionarioToTabelaFuncionario(
  funcionarioId: string,
  mes: number,
  ano: number
) {
  try {
    const funcionario = await prisma.funcionario.findUnique({
      where: { id: funcionarioId },
    });

    if (!funcionario) {
      throw new Error("Funcionário não encontrado");
    }

    const tabelaFuncionario = await prisma.tabelaFuncionarios.findFirst({
      where: {
        mes,
        ano,
      },
    });

    if (!tabelaFuncionario) {
      throw new Error("Tabela de funcionários não encontrada");
    }

    await prisma.tabelaFuncionarios.update({
      where: {
        id: tabelaFuncionario.id,
      },
      data: {
        funcionarios: {
          connect: {
            id: funcionario.id,
          },
        },
      },
    });

    return tabelaFuncionario;
  } catch (e) {
    console.log(e);
  }
}

export async function removeFuncionarioFromTabelaFuncionario(
  funcionarioId: string,
  mes: number,
  ano: number
) {
  try {
    const funcionario = await prisma.funcionario.findUnique({
      where: { id: funcionarioId },
    });

    if (!funcionario) {
      throw new Error("Funcionário não encontrado");
    }

    const tabelaFuncionario = await prisma.tabelaFuncionarios.findFirst({
      where: {
        mes,
        ano,
      },
    });

    if (!tabelaFuncionario) {
      throw new Error("Tabela de funcionários não encontrada");
    }

    await prisma.tabelaFuncionarios.update({
      where: {
        id: tabelaFuncionario.id,
      },
      data: {
        funcionarios: {
          disconnect: {
            id: funcionario.id,
          },
        },
      },
    });

    return tabelaFuncionario;
  } catch (e) {
    console.log(e);
  }
}

export async function createFuncionariosFromJSON(
  funcionarios: CreateFuncionarioInput[]
) {
  for (const funcionario of funcionarios) {
    await createFuncionario(funcionario); // Wait for each creation to finish before proceeding
  }
}

export async function addSalariosToFuncionario(
  funcionarioId: string,
  salarios: AddSalariosToFuncionarioInput // Array of salário objects
) {
  console.log("SALARIOS: ", salarios);
  try {
    // Use Prisma's transaction to ensure atomicity
    await prisma.$transaction(async (prisma) => {
      for (const salario of salarios) {
        await prisma.salarioMensal.create({
          data: {
            mes: salario.mes, // Access `mes` from `salario`
            ano: salario.ano, // Access `ano` from `salario`
            salarioBase: salario.salarioBase, // Access `salarioBase` from `salario`
            horasExtras: salario.horasExtras ?? 0,
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
            funcionario: {
              connect: {
                id: funcionarioId,
              },
            },
          },
        });
      }
    });

    console.log("Salários adicionados com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar salários:", error);
    throw new Error("Falha ao adicionar salários");
  }
}
