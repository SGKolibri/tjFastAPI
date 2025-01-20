import { registerFuncionariosFromJSON } from "../src/modules/funcionario/funcionario.controller";
import { hashPassword } from "../src/utils/hash";
import funcionariosFile from "../src/data/funcionariosData.json";
import prisma from "../src/utils/prisma";
import { createCargos } from "../src/modules/cargo/cargo.services";
import cargosJSON from "../src/data/cargos.json";

async function seed() {
  await createAdmin();
  await registerCargos();
}

const createAdmin = async () => {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error("ADMIN_PASSWORD environment variable is not set.");
  }

  const { hash, salt } = hashPassword(password);

  const adminExists = await prisma.admin.findFirst({
    where: {
      email: "admin@tjinstalacoes.com",
    },
  });
  if (adminExists) {
    return;
  }

  await prisma.admin.create({
    data: {
      id: 0,
      email: "admin@tjinstalacoes.com",
      name: "Admin",
      password: hash,
      salt: salt,
    },
  });
};

const registerCargos = async () => {
  createCargos(cargosJSON);
};
seed().then(() => {
  console.log("Database seeded.");
  prisma.$disconnect();
});

/*
"prisma": {
    "seed": "ts-node ./prisma/seed.ts"
  },

  npx prisma db seed --preview-feature
*/
