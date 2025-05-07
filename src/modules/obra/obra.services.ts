import prisma from "../../utils/prisma";
import { ObraInput, RegisterObraInput } from "./obra.schema";

export async function createObra(data: RegisterObraInput) {
  const { funcionarioIds, ...obraData } = { ...data };

  console.log("Funcionario IDs:", funcionarioIds);

  if (obraData.dataInicio) {
    obraData.dataInicio = formatDateToISO(obraData.dataInicio);
  }
  if (obraData.dataFim) {
    obraData.dataFim = formatDateToISO(obraData.dataFim);
  }

  // Create the obra without funcionario connections
  const obra = await prisma.obra.create({
    data: {
      ...obraData,
    },
  });

  // If there are funcionarios to connect, update them to include this obra's ID
  if (Array.isArray(funcionarioIds) && funcionarioIds.length > 0) {
    // Update each funcionario to add this obra ID to their obrasIDs array
    for (const funcionarioId of funcionarioIds) {
      await prisma.funcionario.update({
        where: { id: funcionarioId },
        data: {
          obras: {
            connect: { id: obra.id },
          },
        },
      });
    }
  }

  // Get the obra with updated data
  const updatedObra = await getObraById(obra.id);
  return updatedObra;
}

function formatDateToISO(dateString: string): string {
  if (dateString.includes("T")) {
    return dateString;
  }

  return `${dateString}T00:00:00Z`;
}

export async function getObraById(id: string) {
  const obra = await prisma.obra.findUnique({
    where: { id },
  });

  // Get funcionarios that have this obra ID in their obrasIDs array
  const funcionarios = await prisma.funcionario.findMany({
    where: {
      obras: {
        some: {
          id,
        },
      },
    },
  });

  return obra ? { ...obra, funcionarios } : null;
}

export async function getObras() {
  const obras = await prisma.obra.findMany();

  // For each obra, get the associated funcionarios
  const obrasWithFuncionarios = await Promise.all(
    obras.map(async (obra) => {
      const funcionarios = await prisma.funcionario.findMany({
        where: {
          obras: {
            some: {
              id: obra.id,
            },
          },
        },
      });

      return { ...obra, funcionarios };
    })
  );

  return obrasWithFuncionarios;
}

export async function updateObra(id: string, data: ObraInput) {
  const { funcionarioIds, ...updatedData } = { ...data };

  // Format dates to ISO-8601 DateTime format if present
  if (updatedData.dataInicio) {
    updatedData.dataInicio = formatDateToISO(updatedData.dataInicio);
  }

  if (updatedData.dataFim) {
    updatedData.dataFim = formatDateToISO(updatedData.dataFim);
  }

  // Update the obra with new data
  const obra = await prisma.obra.update({
    where: { id },
    data: {
      ...updatedData,
    },
  });

  // If funcionarioIds is provided, update the funcionarios
  if (Array.isArray(funcionarioIds)) {
    // First, get all funcionarios that currently have this obra in their obrasIDs
    const currentFuncionarios = await prisma.funcionario.findMany({
      where: {
        obras: {
          some: {
            id,
          },
        },
      },
    });

    // Remove this obra ID from all current funcionarios
    for (const func of currentFuncionarios) {
      await prisma.funcionario.update({
        where: { id: func.id },
        data: {
          obras: {
            disconnect: { id },
          },
        },
      });
    }

    // Add this obra to the new funcionarios
    for (const funcionarioId of funcionarioIds) {
      const funcionario = await prisma.funcionario.findUnique({
        where: { id: funcionarioId },
      });
      if (funcionario) {
        await prisma.funcionario.update({
          where: { id: funcionarioId },
          data: {
            obras: {
              connect: { id },
            },
          },
        });
      }
    }
  }

  // Get the updated obra with funcionarios
  const updatedObra = await getObraById(id);
  return updatedObra;
}

export async function deleteObra(id: string) {
  // First, get all funcionarios that have this obra ID
  const funcionarios = await prisma.funcionario.findMany({
    where: {
      obras: {
        some: {
          id,
        },
      },
    },
  });

  // Remove this obra ID from each funcionario's obrasIDs array
  for (const funcionario of funcionarios) {
    await prisma.funcionario.update({
      where: { id: funcionario.id },
      data: {
        obras: {
          disconnect: { id },
        },
      },
    });
  }

  // Now delete the obra
  const obra = await prisma.obra.delete({
    where: { id },
  });

  return { ...obra, funcionarios };
}
