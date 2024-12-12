import { FastifyReply, FastifyRequest } from "fastify";
import { verifyPassword } from "../../utils/hash";
import { server } from "../../app";
import { createAdmin, findAdminByEmail, findAdmins } from "./admin.services";
import { CreateAdminInput, LoginAdminInput } from "./admin.schemas";

export async function registerAdminHandler(
  request: FastifyRequest<{ Body: CreateAdminInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const admin = await createAdmin(body);
    return reply.status(201).send(admin);
  } catch (e) {
    console.error(e);
    return reply.status(500).send({ message: "Erro ao registrar admin" });
  }
}

export async function loginAdminHandler(
  request: FastifyRequest<{ Body: LoginAdminInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  const admin = await findAdminByEmail(body.email);

  if (!admin)
    return reply.code(401).send({ message: "Invalid email or password" });

  const correctPassword = verifyPassword({
    candidatePassword: body.password,
    salt: admin.salt,
    hash: admin.password,
  });

  if (correctPassword) {
    const { password, salt, ...rest } = admin;
    const accessToken = server.jwt.sign(rest, { expiresIn: "1h" });
    return reply.send({ accessToken, admin: rest });
  }

  return reply.code(401).send({ message: "Invalid email or password" });
}

export async function getAdminsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const admins = await findAdmins();
  return reply.send(admins);
}

export async function isAdminAuthenticatedHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    return reply.status(200).send({ message: "Authenticated" });
  } catch (e) {
    console.error(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}
