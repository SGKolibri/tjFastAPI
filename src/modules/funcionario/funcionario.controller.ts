import { FastifyReply, FastifyRequest } from "fastify";
import {
  createFuncionario,
  // findFuncionarioByEmail,
  findFuncionarioById,
  findFuncionarios,
} from "./funcionario.services";
import {
  CreateFuncionarioInput,
  /*LoginFuncionarioInput,*/
  GetFuncionarioByInput,
} from "./funcionario.schema";
import { verifyPassword } from "../../utils/hash";
import { server } from "../../app";

export async function registerFuncionarioHandler(
  request: FastifyRequest<{ Body: CreateFuncionarioInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const user = await createFuncionario(body);

    return reply.status(201).send(user);
  } catch (e) {
    console.error(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

export async function getFuncionariosHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const funcionarios = await findFuncionarios();
    return reply.status(201).send(funcionarios);
  } catch (e) {
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

export async function getFuncionarioByIdHandler(
  request: FastifyRequest<{ Params: GetFuncionarioByInput }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  console.log("ID:", id);
  try {
    const funcionario = await findFuncionarioById(id);
    if (!funcionario) {
      return reply.status(404).send({ message: "Funcionario não encontrado" });
    }
    return reply.status(201).send(funcionario);
  } catch (e) {
    console.error("Error fetching funcionario: ", e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}
