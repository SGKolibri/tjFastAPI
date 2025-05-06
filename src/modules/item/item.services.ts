import { PrismaClient } from "@prisma/client";
import { ItemInput, ItemObraInput, RegisterItemInput } from "./item.schema";

export async function createItem(
  input: RegisterItemInput,
  prisma: PrismaClient
) {
  const item = await prisma.item.create({
    data: {
      ...input,
    },
  });

  return item;
}

export async function getItems(prisma: PrismaClient) {
  return prisma.item.findMany({
    orderBy: {
      nome: "asc",
    },
  });
}

export async function getItemById(id: string, prisma: PrismaClient) {
  return prisma.item.findUnique({
    where: {
      id,
    },
    include: {
      obras: {
        include: {
          obra: true,
        },
      },
    },
  });
}

export async function updateItem(
  id: string,
  data: ItemInput,
  prisma: PrismaClient
) {
  return prisma.item.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteItem(id: string, prisma: PrismaClient) {
  return prisma.item.delete({
    where: {
      id,
    },
  });
}

// Functions to handle the relationship between items and obras
export async function assignItemToObra(
  input: ItemObraInput,
  prisma: PrismaClient
) {
  const { itemId, obraId, quantidade, valorTotal, observacoes } = input;

  // Calculate valorTotal if not provided
  let finalValorTotal = valorTotal;
  if (!valorTotal) {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (item) {
      finalValorTotal = item.precoUnitario * quantidade;
    }
  }

  return prisma.itemObra.create({
    data: {
      itemId,
      obraId,
      quantidade,
      valorTotal: finalValorTotal,
      observacoes,
    },
    include: {
      item: true,
      obra: true,
    },
  });
}

export async function updateItemInObra(
  id: string,
  input: Partial<ItemObraInput>,
  prisma: PrismaClient
) {
  const { quantidade } = input;

  // Calculate new valorTotal if quantidade changes
  let data: any = { ...input };

  if (quantidade) {
    const itemObra = await prisma.itemObra.findUnique({
      where: { id },
      include: { item: true },
    });

    if (itemObra && itemObra.item) {
      data.valorTotal = itemObra.item.precoUnitario * quantidade;
    }
  }

  return prisma.itemObra.update({
    where: { id },
    data,
    include: {
      item: true,
      obra: true,
    },
  });
}

export async function removeItemFromObra(id: string, prisma: PrismaClient) {
  return prisma.itemObra.delete({
    where: { id },
  });
}

export async function getItemsByObra(obraId: string, prisma: PrismaClient) {
  return prisma.itemObra.findMany({
    where: {
      obraId,
    },
    include: {
      item: true,
    },
    orderBy: {
      item: {
        nome: "asc",
      },
    },
  });
}

export async function getObrasByItem(itemId: string, prisma: PrismaClient) {
  return prisma.itemObra.findMany({
    where: {
      itemId,
    },
    include: {
      obra: true,
    },
    orderBy: {
      obra: {
        nome: "asc",
      },
    },
  });
}
