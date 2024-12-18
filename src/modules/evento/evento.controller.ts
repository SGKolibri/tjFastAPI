import { FastifyReply, FastifyRequest } from "fastify";
import { server } from "../../app";
import { CreateEventoInput } from "./evento.schema";
import { createEvento, getEventos } from "./evento.services";

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
