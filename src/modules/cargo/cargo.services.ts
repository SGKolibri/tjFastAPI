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
  // verify if cargos already exists
  const cargosExists = await prisma.cargo.findMany({
    where: {
      nome: {
        in: input.map((cargo) => cargo.nome),
      },
    },
  });

  // filter cargos that already exists
  const cargosToCreate = input.filter(
    (cargo) => !cargosExists.some((c) => c.nome === cargo.nome)
  );

  // create cargos
  const cargos = await prisma.cargo.createMany({
    data: cargosToCreate,
  });
  return cargos;
}

export async function getCargos() {
  return await prisma.cargo.findMany();
}
