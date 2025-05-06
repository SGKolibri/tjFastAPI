import { FastifyReply, FastifyRequest } from "fastify";
import {
  createObra,
  getObraById,
  getObras,
  updateObra,
  deleteObra,
} from "./obra.services";
import { RegisterObraInput, ObraInput } from "./obra.schema";
import { z } from "zod";

export async function registerObraHandler(
  request: FastifyRequest<{ Body: RegisterObraInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const obra = await createObra(body);
    return reply.status(201).send(obra);
  } catch (e) {
    console.error(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

export async function getObrasHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const obras = await getObras();
    return reply.status(200).send(obras);
  } catch (e) {
    console.error(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

export async function getObraByIdHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  try {
    const obra = await getObraById(id);
    if (!obra) {
      return reply.status(404).send({ message: "Obra not found" });
    }
    return reply.status(200).send(obra);
  } catch (e) {
    console.error(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

export async function updateObraHandler(
  request: FastifyRequest<{
    Params: { id: string };
    Body: ObraInput;
  }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const body = request.body;

  try {
    const obra = await updateObra(id, body);
    return reply.status(200).send(obra);
  } catch (e) {
    console.error(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

export async function deleteObraHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  try {
    const obra = await deleteObra(id);
    return reply.status(200).send(obra);
  } catch (e) {
    console.error(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}
