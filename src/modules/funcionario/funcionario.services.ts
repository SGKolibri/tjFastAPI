import prisma from "../../utils/prisma";
import { CreateFuncionarioInput } from "./funcionario.schema";
import { hashPassword } from "../../utils/hash";

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
              salarioBase: salario.base, // Substitua pelos campos reais
              horasExtras: salario.horasExtras ?? 0, // Valores opcionais com fallback
              descontos: salario.descontos ?? 0,
              bonus: salario.bonus ?? 0,
              salarioTotal: salario.total,
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

export async function findFuncionarios() {
  return prisma.funcionario.findMany({
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
          salarioTotal: true,
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
  return prisma.funcionario.findUnique({
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
          salarioTotal: true,
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
