import { hashPassword } from "../src/utils/hash";
import funcionariosFile from "../src/data/funcionariosData.json";
import prisma from "../src/utils/prisma";
import { createCargos } from "../src/modules/cargo/cargo.services";
import { createFuncionariosFromJSON } from "../src/modules/funcionario/funcionario.services";
import obrasJSON from "../src/data/obras.json";
import cargosJSON from "../src/data/cargos.json";
import eventosJSON from "../src/data/eventos.json";
import materialsJSON from "../src/data/materials.json";
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
  await registerObras();
  await registerMaterials();
  await registerEventos();
};

const registerCargos = async () => {
  createCargos(cargosJSON);
};

const registerEventos = async () => {
  console.log("Seeding eventos...");

  const existingEventos = await prisma.evento.count();
  if (existingEventos > 0) {
    console.log(
      `Skipping eventos seeding - ${existingEventos} eventos already exist`
    );
    return;
  }

  const eventosCreated = await Promise.all(
    eventosJSON.map(async (evento) => {
      return prisma.evento.create({
        data: {
          titulo: evento.titulo,
          descricao: evento.descricao,
          dataInicio: new Date(evento.dataInicio),
          dataFim: new Date(evento.dataFim),
          allDay: evento.allDay,
        },
      });
    })
  );

  console.log(`Created ${eventosCreated.length} eventos`);
};

const registerObras = async () => {
  console.log("Seeding obras...");

  const existingObras = await prisma.obra.count();
  if (existingObras > 0) {
    console.log(
      `Skipping obras seeding - ${existingObras} obras already exist`
    );
    return;
  }

  const obrasCreated = await Promise.all(
    obrasJSON.map(async (obra) => {
      return prisma.obra.create({
        data: {
          nome: obra.nome,
          cliente: obra.cliente,
          valor: obra.valor,
          dataInicio: new Date(obra.dataInicio),
          dataFim: new Date(obra.dataFim),
          status: obra.status,
        },
      });
    })
  );

  console.log(`Created ${obrasCreated.length} obras`);
};

const registerMaterials = async () => {
  console.log("Seeding materials...");

  const existingMaterials = await prisma.material.count();
  if (existingMaterials > 0) {
    console.log(
      `Skipping materials seeding - ${existingMaterials} materials already exist`
    );
    return;
  }

  const materialsCreated = await Promise.all(
    materialsJSON.map(async (material) => {
      return prisma.material.create({
        data: {
          nome: material.nome,
          descricao: material.descricao,
          categoria: material.categoria,
          unidade: material.unidade,
          precoUnitario: material.precoUnitario,
          fornecedor: material.fornecedor,
          codigo: material.codigo,
          quantidade: material.quantidade,
          status: material.status,
          localizacao: material.localizacao,
          dataCompra: material.dataCompra
            ? new Date(material.dataCompra)
            : null,
          dataEntrega: material.dataEntrega
            ? new Date(material.dataEntrega)
            : null,
          numeroNota: material.numeroNota,
        },
      });
    })
  );

  console.log(`Created ${materialsCreated.length} materials`);
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
