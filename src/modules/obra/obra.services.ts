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

  const funcionarioConnections =
    Array.isArray(funcionarioIds) && funcionarioIds.length > 0
      ? { connect: funcionarioIds.map((id) => ({ id })) }
      : undefined;

  const obra = await prisma.obra.create({
    data: {
      ...obraData,
      funcionarios: funcionarioConnections,
    },
    include: {
      funcionarios: true,
    },
  });

  return obra;
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
    include: {
      funcionarios: true,
    },
  });
  return obra;
}

export async function getObras() {
  const obras = await prisma.obra.findMany({
    include: {
      funcionarios: true,
    },
  });
  return obras;
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

  // First, get the current obra to check existing funcionarios
  const currentObra = await prisma.obra.findUnique({
    where: { id },
    include: { funcionarios: true },
  });

  // Make sure funcionarioIds is properly handled
  const funcionarioConnections =
    Array.isArray(funcionarioIds) && funcionarioIds.length > 0
      ? {
          // Disconnect all existing relationships first
          disconnect: currentObra?.funcionarios.map((f) => ({ id: f.id })),
          // Then connect with the new IDs
          connect: funcionarioIds.map((id) => ({ id })),
        }
      : undefined;

  // Update the obra with new data
  const obra = await prisma.obra.update({
    where: { id },
    data: {
      ...updatedData,
      funcionarios: funcionarioConnections,
    },
    include: {
      funcionarios: true,
    },
  });

  return obra;
}

export async function deleteObra(id: string) {
  const obra = await prisma.obra.delete({
    where: { id },
    include: {
      funcionarios: true,
    },
  });
  return obra;
}
