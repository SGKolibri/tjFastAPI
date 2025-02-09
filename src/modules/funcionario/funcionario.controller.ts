import { FastifyReply, FastifyRequest } from "fastify";
import {
  addSalarioToFuncionario,
  createFuncionario,
  deleteSalarioFromFuncionario,
  // findFuncionarioByEmail,
  findFuncionarioById,
  findFuncionarios,
  getSalarioFromFuncionario,
  getTotalFuncionarios,
  updateFuncionario,
  updateFuncionarioStatus,
} from "./funcionario.services";
import {
  AddSalarioToFuncionarioInput,
  CreateFuncionarioInput,
  /*LoginFuncionarioInput,*/
  GetFuncionarioByInput,
} from "./funcionario.schema";

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

export async function updateFuncionarioStatusHandler(
  request: FastifyRequest<{
    Params: { id: string };
    Body: { status: boolean };
  }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  try {
    const updatedFuncionario = await updateFuncionarioStatus(id);
    return reply.status(201).send(updatedFuncionario);
  } catch (e) {
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

export async function getFuncionarioByIdHandler(
  request: FastifyRequest<{ Params: GetFuncionarioByInput }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    const funcionario = await findFuncionarioById(id);
    if (!funcionario) {
      return reply.status(404).send({ message: "Funcionario não encontrado" });
    }
    return reply.status(201).send(funcionario);
  } catch (e) {
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

export async function registerManyFuncionariosAtOnceHandler(
  request: FastifyRequest<{ Body: CreateFuncionarioInput[] }>,
  reply: FastifyReply
) {
  const funcionarios = request.body;

  try {
    const promises = funcionarios.map((funcionario) =>
      createFuncionario(funcionario)
    );
    const funcionariosCreated = await Promise.all(promises);

    return reply.status(201).send(funcionariosCreated);
  } catch (e) {
    console.error(e);
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
  const body = request.body;

  console.log("ID: ", id);
  console.log("BODY: ", body);

  const funcionario = await findFuncionarioById(id);
  if (!funcionario) {
    return reply.status(404).send({ message: "Funcionário não encontrado." });
  }

  try {
    const funcionario = await addSalarioToFuncionario(id, body);
    return reply.status(201).send({ status: 201, funcionario: funcionario });
  } catch (e) {
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

export async function AddSalariosToFuncionarioHandler(
  request: FastifyRequest<{
    Params: { id: string };
    Body: AddSalarioToFuncionarioInput[];
  }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const salarios = request.body;
  try {
    const funcionario = await findFuncionarioById(id);
    if (!funcionario) {
      return reply.status(404).send({ message: "Funcionário não encontrado." });
    }

    const promises = salarios.map((salario) =>
      addSalarioToFuncionario(id, salario)
    );
    const salariosAdded = await Promise.all(promises);
    return reply.status(201).send(salariosAdded);
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

export async function getTotalFuncionariosHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const totalFuncionarios = await getTotalFuncionarios();
    return reply.status(201).send({ totalFuncionarios });
  } catch (e) {
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}
