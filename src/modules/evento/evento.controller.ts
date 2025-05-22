import { FastifyReply, FastifyRequest } from "fastify";
import { server } from "../../app";
import { CreateEventoInput } from "./evento.schema";
import {
  createEvento,
  deleteEvento,
  getEventos,
  updateEvento,
} from "./evento.services";

export async function createEventoHandler(
  request: FastifyRequest<{ Body: CreateEventoInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const evento = await createEvento(body);
    return reply.status(201).send(evento);
  } catch (e) {
    console.error(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

export async function getEventosHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const eventos = await getEventos();
    return reply.status(200).send({ eventos: eventos });
  } catch (e) {
    console.error(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

export async function deleteEventoHandler(
  request: FastifyRequest<{ Params: { eventoId: string } }>,
  reply: FastifyReply
) {
  console.log("Delete evento handler");
  const { eventoId } = request.params;

  console.log("ID do evento: ", eventoId);

  try {
    await deleteEvento(eventoId);
    return reply.status(204).send({ message: "Evento deletado com sucesso" });
  } catch (e) {
    console.error(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

export async function updateEventoHandler(
  request: FastifyRequest<{
    Params: { eventoId: string };
    Body: CreateEventoInput;
  }>,
  reply: FastifyReply
) {
  const { eventoId } = request.params;
  const body = request.body;

  try {
    const evento = await updateEvento(eventoId, body);
    return reply.status(200).send(evento);
  } catch (e) {
    console.error(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}
