import pLimit from "p-limit";
import prisma from "../../utils/prisma";
import {
  AddSalarioToFuncionarioInput,
  CreateFuncionarioInput,
} from "./funcionario.schema";

export async function createFuncionario(input: CreateFuncionarioInput) {
  const { name, cargo, chavePix, banco, salarios, contato, cpf, status } =
    input;

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
          Number(funcionario.id),
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

export async function updateFuncionarioStatus(id: number) {
  if (!id || typeof id !== "number") {
    throw new Error("Invalid ID provided");
  }

  const funcionario = await prisma.funcionario.findUnique({
    where: { id: Number(id) }, // Ensure id is treated as a number
  });

  if (!funcionario) {
    throw new Error("Funcionário não encontrado");
  }
  console.log("FUNCIONARIO STATUS: ", funcionario.status);
  const status = funcionario.status ? false : true;

  try {
    return await prisma.funcionario.update({
      where: { id: Number(id) }, // Ensure id is treated as a number
      data: {
        status,
      },
    });
  } catch (error) {
    console.error("Error updating funcionario status: ", error);
    throw new Error("Failed to update funcionario status");
  }
}

export async function findFuncionarioById(id: number) {
  return await prisma.funcionario.findUnique({
    where: { id: Number(id) }, // Ensure id is treated as a number

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
  id: number,
  input: CreateFuncionarioInput
) {
  const { name, cargo, chavePix, banco, salarios, contato, cpf, status } =
    input;

  if (!cargo || !cargo.nome) {
    throw new Error("Cargo é obrigatório");
  }

  console.log("FUNCIONARIO: ", input);

  try {
    const updatedFuncionario = await prisma.funcionario.update({
      where: { id: Number(id) }, // Ensure id is treated as a number
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
        salarios: salarios
          ? {
              upsert: salarios.map((salario) => ({
                where: {
                  // Construct a unique identifier object
                  mes_ano_funcionarioId: {
                    mes: salario.mes,
                    ano: salario.ano,
                    funcionarioId: Number(id), // Ensure id is treated as a number
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
  funcionarioId: number,
  input: AddSalarioToFuncionarioInput
) {
  const { salario } = input;
  try {
    const funcionario = await prisma.funcionario.update({
      where: { id: Number(funcionarioId) },
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
  funcionarioId: number,
  salarioId: number
) {
  return await prisma.salarioMensal.delete({
    where: {
      id: salarioId,
      funcionarioId: Number(funcionarioId),
    },
  });
}

export async function getSalarioFromFuncionario(
  funcionarioId: number,
  salarioId: number
) {
  return await prisma.salarioMensal.findUnique({
    where: {
      id: salarioId,
      funcionarioId: Number(funcionarioId),
    },
  });
}

export async function getTotalFuncionarios() {
  return await prisma.funcionario.count();
}

// Tabela Funcionarios is identified by month and year, and so is the funcionario salary
export async function addFuncionarioToTabelaFuncionario(
  funcionarioId: number,
  mes: number,
  ano: number
) {
  console.log("FUNCIONARIO ID: ", Number(funcionarioId));
  try {
    const funcionario = await prisma.funcionario.findUnique({
      where: { id: Number(funcionarioId) },
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

    const affirmedFuncionarioId = Number(funcionario.id);
    await prisma.tabelaFuncionarios.update({
      where: {
        id: affirmedFuncionarioId,
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
  funcionarioId: number,
  mes: number,
  ano: number
) {
  try {
    const funcionario = await prisma.funcionario.findUnique({
      where: { id: Number(funcionarioId) },
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

    const affirmedFuncionarioId = Number(funcionario.id);
    await prisma.tabelaFuncionarios.update({
      where: {
        id: affirmedFuncionarioId,
      },
      data: {
        funcionarios: {
          connect: {
            id: Number(funcionario.id),
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
  funcionarioId: number,
  mes: number,
  ano: number
) {
  try {
    const funcionario = await prisma.funcionario.findUnique({
      where: { id: Number(funcionarioId) },
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

    const affirmedFuncionarioId = Number(funcionario.id);
    await prisma.tabelaFuncionarios.update({
      where: {
        id: affirmedFuncionarioId,
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
