import { FastifyReply, FastifyRequest } from "fastify";
import { CreateCargoInput } from "./cargo.schema";
import { createCargo, createCargos, getCargos } from "./cargo.services";

export async function createCargoHandler(
  request: FastifyRequest<{ Body: CreateCargoInput }>,
  reply: FastifyReply
) {
  const body = request.body;
  try {
    const cargo = await createCargo(body);
    return reply.status(201).send(cargo);
  } catch (e) {
    console.error(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

export async function createCargosFromJSONHandler(
  request: FastifyRequest<{ Body: CreateCargoInput[] }>,
  reply: FastifyReply
) {
  const body = request.body;
  try {
    const cargos = await createCargos(body);
    return reply.status(201).send(cargos);
  } catch (e) {
    console.error(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

export async function getCargosHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const cargos = await getCargos();
    return reply.status(201).send(cargos);
  } catch (e) {
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}
