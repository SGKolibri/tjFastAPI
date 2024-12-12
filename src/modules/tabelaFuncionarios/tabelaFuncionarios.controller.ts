import { FastifyReply, FastifyRequest } from "fastify";
import { CreateTabelaFuncionarioInput } from "./tabelaFuncionarios.schema";
import {
  createTabelaFuncionario,
  getAllTabelasFuncionario,
} from "./tabelaFuncionarios.services";

export async function createTabelaFuncionarioHandler(
  request: FastifyRequest<{ Params: { mes: string; ano: string } }>,
  reply: FastifyReply
) {
  const { mes, ano } = request.params;
  const input: CreateTabelaFuncionarioInput = {
    mes: parseInt(mes, 10),
    ano: parseInt(ano, 10),
    anomes: `${ano}-${mes}`,
  }; // 10
  try {
    const tabelaFuncionario = await createTabelaFuncionario(input);
    return reply.status(201).send(tabelaFuncionario);
  } catch (error) {
    return reply.status(500).send({ message: "Internal Server Error", error });
  }
}

export async function getAllTabelasFuncionarioHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const tabelasFuncionario = await getAllTabelasFuncionario();
    return reply.send(tabelasFuncionario);
  } catch (error) {
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}