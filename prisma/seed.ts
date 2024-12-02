import { hashPassword } from "../src/utils/hash";
import prisma from "../src/utils/prisma";

async function seed() {
  const password = process.env.ADMIN_PASSWORD || "tjadmin";

  const { hash, salt } = await hashPassword(password);

  await prisma.admin.create({
    data: {
      id: "cm41pxcrz000008mq0v4o0zw8",
      email: "admin@tjinstalacoes.com",
      name: "Admin",
      password: hash,
      salt: salt,
    },
  });
}

seed().then(() => {
  console.log("Database seeded.");
  prisma.$disconnect();
});
