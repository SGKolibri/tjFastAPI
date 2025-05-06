import { hashPassword } from "../src/utils/hash";
import funcionariosFile from "../src/data/funcionariosData.json";
import prisma from "../src/utils/prisma";
import { createCargos } from "../src/modules/cargo/cargo.services";
import { createFuncionariosFromJSON } from "../src/modules/funcionario/funcionario.services";
import cargosJSON from "../src/data/cargos.json";
import itemsJSON from "../src/data/items.json";
import funcionariosData from "../src/data/funcionariosData.json";

async function seed() {
  await createAdmin();
  await register();
}

const createAdmin = async () => {
  const password = process.env.ADMIN_PASSWORD;
  const id = process.env.ADMIN_CUID;

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
      id: id,
      email: "admin@tjinstalacoes.com",
      name: "TJAdmin",
      password: hash,
      salt: salt,
    },
  });
};

const register = async () => {
  await registerCargos();
  await createFuncionarios();
  // await registerItems();
};

const registerCargos = async () => {
  createCargos(cargosJSON);
};

// const registerItems = async () => {
//   console.log("Seeding items...");

//   // Check if items already exist to avoid duplicates
//   const existingItems = await prisma.item.count();
//   if (existingItems > 0) {
//     console.log(
//       `Skipping items seeding - ${existingItems} items already exist`
//     );
//     return;
//   }

//   // Create all items from the JSON file
//   const itemsCreated = await Promise.all(
//     itemsJSON.map(async (item) => {
//       return prisma.item.create({
//         data: {
//           nome: item.nome,
//           descricao: item.descricao,
//           categoria: item.categoria,
//           unidade: item.unidade,
//           precoUnitario: item.precoUnitario,
//           fornecedor: item.fornecedor,
//           codigo: item.codigo,
//         },
//       });
//     })
//   );

//   console.log(`Created ${itemsCreated.length} items`);
// };

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
