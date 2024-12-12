import prisma from "../../utils/prisma";
import { CreateTabelaFuncionarioInput } from "./tabelaFuncionarios.schema";

export async function createTabelaFuncionario(
  input: CreateTabelaFuncionarioInput
) {
  console.log("ANO/MES", input.anomes);
  try {
    let existingTabela = await prisma.tabelaFuncionarios.findFirst({
      where: {
        mes: input.mes,
        ano: input.ano,
      },
      include: {
        funcionarios: {
          include: {
            cargo: true,
            salarios: {
              include: {
                beneficios: true,
              },
            },
          },
        },
      },
    });

    // check if there are any funcionarios that have not been added to the tabela, and add them
    const funcionarios = await prisma.funcionario.findMany({
      where: {
        NOT: {
          tabelaFuncionarios: {
            some: {
              mes: input.mes,
              ano: input.ano,
            },
          },
        },
        salarios: {
          some: {
            mes: input.mes,
            ano: input.ano,
          },
        },
      },
    });

    // add funcionarios to the tabela
    if (existingTabela) {
      const funcionariosIds = existingTabela.funcionarios.map(
        (funcionario) => funcionario.id
      );

      const funcionariosToAdd = funcionarios.filter(
        (funcionario) => !funcionariosIds.includes(funcionario.id)
      );

      if (funcionariosToAdd.length > 0) {
        await prisma.tabelaFuncionarios.update({
          where: {
            id: existingTabela.id,
          },
          data: {
            funcionarios: {
              connect: funcionariosToAdd.map((funcionario) => ({
                id: funcionario.id,
              })),
            },
          },
        });
      }

      return getTabelaFuncionarioByMonthAndYear(input.mes, input.ano);
    }

    await prisma.tabelaFuncionarios.create({
      data: {
        ano: input.ano,
        mes: input.mes,
        anomes: input.anomes,
        funcionarios: {
          connect: funcionarios.map((funcionario) => ({
            id: funcionario.id,
          })),
        },
      },
    });

    return getTabelaFuncionarioByMonthAndYear(input.mes, input.ano);
  } catch (e) {
    console.log(e);
  }
}

export async function getTabelaFuncionarioByMonthAndYear(
  month: number,
  year: number
) {
  try {
    const tabela = await prisma.tabelaFuncionarios.findFirst({
      where: {
        mes: month,
        ano: year,
      },
      include: {
        funcionarios: {
          include: {
            cargo: true,
            salarios: {
              include: {
                beneficios: true,
              },
            },
          },
        },
      },
    });
    return tabela;
  } catch (e) {
    console.log(e);
  }
}

export async function getAllTabelasFuncionario() {
  return prisma.tabelaFuncionarios.findMany({
    include: {
      funcionarios: true,
    },
  });
}
