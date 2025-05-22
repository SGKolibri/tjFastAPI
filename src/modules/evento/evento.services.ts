import prisma from "../../utils/prisma";
import { CreateEventoInput, ReturnEventoInput } from "./evento.schema";

export async function createEvento(input: CreateEventoInput) {
  const { titulo, descricao, dataInicio, dataFim, allDay } = input;

  return prisma.evento.create({
    data: {
      titulo,
      descricao,
      dataInicio,
      dataFim,
      allDay,
    },
  });
}

export async function getEventos() {
  return prisma.evento.findMany({
    orderBy: {
      dataInicio: "asc",
    },
  });
}

export async function deleteEvento(id: string) {
  return prisma.evento.delete({
    where: {
      id,
    },
  });
}

export async function updateEvento(
  id: string,
  input: Partial<CreateEventoInput>
) {
  return prisma.evento.update({
    where: { id },
    data: input,
  });
}

export async function getEventoById(id: string) {
  return prisma.evento.findUnique({
    where: { id },
  });
}
