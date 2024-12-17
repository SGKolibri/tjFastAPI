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
