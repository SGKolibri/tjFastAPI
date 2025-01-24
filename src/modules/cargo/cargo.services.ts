import prisma from "../../utils/prisma";
import { CreateCargoInput } from "./cargo.schema";

export async function createCargo(input: CreateCargoInput) {
  const { nome } = input;

  // verify if cargo already exists
  const cargoExists = await prisma.cargo.findFirst({
    where: {
      nome,
    },
  });

  // if cargo already exists, throw an error
  if (cargoExists) {
    throw new Error("Cargo já existe no banco de dados");
  }

  const cargo = await prisma.cargo.create({
    data: {
      nome,
    },
  });
  return cargo;
}

export async function createCargos(input: CreateCargoInput[]) {
  console.log("1 - Input: ", input);

  // verify if cargos already exists
  const existingCargoNames = await prisma.cargo
    .findMany({
      select: { nome: true },
    })
    .then((cargos) => cargos.map((cargo) => cargo.nome));
  console.log("2 - existingCargoNames: ", existingCargoNames);

  // filter cargos that already exists
  const cargosToCreate = input.filter(
    (cargo) => !existingCargoNames.includes(cargo.nome)
  );
  console.log("3 - cargosToCreate: ", cargosToCreate);

  // create cargos
  const cargos = await prisma.cargo.createMany({
    data: cargosToCreate,
  });
  return cargos;
}

export async function getCargos() {
  return await prisma.cargo.findMany();
}
