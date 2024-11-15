import { hashPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import { CreateAdminInput } from "./admin.schemas";

export async function createAdmin(input: CreateAdminInput) {
  const { password, ...rest } = input; // password is hashed in the service, the rest of the fields are passed as is

  const { hash, salt } = hashPassword(password);

  const admin = await prisma.admin.create({
    data: { ...rest, salt, password: hash },
  });

  return admin;
}

export async function findAdmins() {
  return prisma.admin.findMany({
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
}

export async function findAdminByEmail(email: string) {
  return prisma.admin.findUnique({
    where: { email },
  });
}
