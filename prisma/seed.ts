import { hashPassword } from "../src/utils/hash";
import funcionariosFile from "../src/data/funcionariosData.json";
import prisma from "../src/utils/prisma";
import { createCargos } from "../src/modules/cargo/cargo.services";
import { createFuncionariosFromJSON } from "../src/modules/funcionario/funcionario.services";
import cargosJSON from "../src/data/cargos.json";
import funcionariosData from "../src/data/funcionariosData.json";

async function seed() {
  await createAdmin();
  await register();
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
      id: 1,
      email: "admin@tjinstalacoes.com",
      name: "TJAdmin",
      password: hash,
      salt: salt,
    },
  });
};

const register = async () => {
  await registerCargos();
  // await createFuncionarios();
};

const registerCargos = async () => {
  createCargos(cargosJSON);
};

const createFuncionarios = async () => {
  await createFuncionariosFromJSON(funcionariosData);
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
