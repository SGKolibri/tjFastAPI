import { FastifyReply, FastifyRequest } from "fastify";
import {
  createUser,
  findUserByEmail,
  findUserById,
  findUsers,
} from "./user.services";
import {
  CreateUserInput,
  /*LoginUserInput,*/
  GetUserByInput,
} from "./user.schema";
import { verifyPassword } from "../../utils/hash";
import { server } from "../../app";

export async function registerUserHandler(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const user = await createUser(body);

    return reply.status(201).send(user);
  } catch (e) {
    console.error(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

// export async function loginUserHandler(
//   request: FastifyRequest<{ Body: LoginUserInput }>,
//   reply: FastifyReply
// ) {
//   const body = request.body;

//   // find user by email
//   const user = await findUserByEmail(body.email);

//   if (!user)
//     return reply.code(401).send({ message: "Invalid email or password" });

//   // verify password
//   const correctPassword = verifyPassword({
//     candidatePassword: body.password,
//     salt: user.salt,
//     hash: user.password,
//   });

//   // if password is correct, return accessToken
//   if (correctPassword) {
//     const { password, salt, ...rest } = user;
//     const accessToken = server.jwt.sign(rest, { expiresIn: "1h" });
//     return reply.send({ accessToken, user: rest });
//   }

//   return reply.code(401).send({ message: "Invalid email or password" });
// }

export async function getUsersHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const users = await findUsers();
  return reply.send(users);
}

export async function getUserByIdHandler(
  request: FastifyRequest<{ Params: GetUserByInput }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  try {
    const user = await findUserById(Number(id));
    if (!user) return reply.status(404).send({ message: "User not found" });
    return reply.status(200).send(user);
  } catch (e) {
    console.error(e);
    return;
  }
}
