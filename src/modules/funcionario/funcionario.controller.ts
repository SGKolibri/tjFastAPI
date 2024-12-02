import { FastifyReply, FastifyRequest } from "fastify";
import {
  addSalarioToFuncionario,
  createFuncionario,
  deleteSalarioFromFuncionario,
  // findFuncionarioByEmail,
  findFuncionarioById,
  findFuncionarios,
  getSalarioFromFuncionario,
  updateFuncionario,
} from "./funcionario.services";
import {
  AddSalarioToFuncionarioInput,
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
  request: FastifyRequest<{ Querystring: { search: string } }>,
  reply: FastifyReply
) {
  try {
    const { search } = request.query;
    const funcionarios = await findFuncionarios(search);
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

export async function updateFuncionarioHandler(
  request: FastifyRequest<{
    Params: { id: string };
    Body: CreateFuncionarioInput;
  }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const body = request.body;

  try {
    const updatedFuncionario = await updateFuncionario(id, body);
    return reply.status(201).send(updatedFuncionario);
  } catch (e) {
    return reply.status(500).send({ message: "Could not update funcionario." });
  }
}

export async function addSalarioToFuncionarioHandler(
  request: FastifyRequest<{
    Params: { id: string };
    Body: AddSalarioToFuncionarioInput;
  }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  const funcionario = await findFuncionarioById(id);
  if (!funcionario) {
    return reply.status(404).send({ message: "Funcionário não encontrado." });
  }

  const salarioExists = funcionario.salarios.find(
    (salario) =>
      salario.mes === request.body.salario.mes &&
      salario.ano === request.body.salario.ano
  );

  if (salarioExists) {
    return reply.status(400).send({ message: "Salário já cadastrado." });
  }

  const body = request.body;
  try {
    const funcionario = await addSalarioToFuncionario(id, body);
    return reply.status(201).send(funcionario);
  } catch (e) {
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

export async function deleteSalarioFromFuncionarioHandler(
  request: FastifyRequest<{
    Params: { funcionarioId: string; salarioId: string };
  }>,
  reply: FastifyReply
) {
  const { funcionarioId, salarioId } = request.params;

  const funcionario = await findFuncionarioById(funcionarioId);
  if (!funcionario) {
    return reply.status(404).send({ message: "Funcionário não encontrado." });
  }

  const salario = await getSalarioFromFuncionario(funcionarioId, salarioId);
  if (!salario) {
    return reply.status(404).send({ message: "Salário não encontrado." });
  }
  console.log("Salario:", salario);

  try {
    const deletedSalario = deleteSalarioFromFuncionario(
      funcionarioId,
      salarioId
    );
    return reply.status(201).send({ message: "Salário deletado." });
  } catch (e) {
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}
