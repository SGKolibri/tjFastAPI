import prisma from "../../utils/prisma";
import { CreateUserInput } from "./user.schema";
import { hashPassword } from "../../utils/hash";

export async function createUser(input: CreateUserInput) {
  // const { password, ...rest } = input;

  // const { hash, salt } = hashPassword(password);

  // const user = await prisma.user.create({
  //   data: { ...rest, salt, password: hash },
  // });

  const { email, name } = input;

  const user = await prisma.user.create({
    data: {
      email,
      name,
    },
  });

  return user;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function findUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
}

export async function findUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
}
