import { FastifyReply, FastifyRequest } from "fastify";
import { ItemInput, ItemObraInput, RegisterItemInput } from "./item.schema";
import * as itemService from "./item.services";
import prisma from "../../utils/prisma";

export async function registerItemHandler(
  request: FastifyRequest<{
    Body: RegisterItemInput;
  }>,
  reply: FastifyReply
) {
  try {
    const item = await itemService.createItem(request.body, prisma);
    return reply.code(201).send(item);
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "Error creating item" });
  }
}

export async function getItemsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const items = await itemService.getItems(prisma);
    return reply.code(200).send(items);
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "Error fetching items" });
  }
}

export async function getItemHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const item = await itemService.getItemById(request.params.id, prisma);

    if (!item) {
      return reply.code(404).send({ message: "Item not found" });
    }

    return reply.code(200).send(item);
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "Error fetching item" });
  }
}

export async function updateItemHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
    Body: ItemInput;
  }>,
  reply: FastifyReply
) {
  try {
    const item = await itemService.updateItem(
      request.params.id,
      request.body,
      prisma
    );

    return reply.code(200).send(item);
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "Error updating item" });
  }
}

export async function deleteItemHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    await itemService.deleteItem(request.params.id, prisma);
    return reply.code(204).send();
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "Error deleting item" });
  }
}

// Controllers for item-obra relationship
export async function assignItemToObraHandler(
  request: FastifyRequest<{
    Body: ItemObraInput;
  }>,
  reply: FastifyReply
) {
  try {
    const itemObra = await itemService.assignItemToObra(request.body, prisma);
    return reply.code(201).send(itemObra);
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "Error assigning item to obra" });
  }
}

export async function updateItemInObraHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
    Body: Partial<ItemObraInput>;
  }>,
  reply: FastifyReply
) {
  try {
    const itemObra = await itemService.updateItemInObra(
      request.params.id,
      request.body,
      prisma
    );

    return reply.code(200).send(itemObra);
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "Error updating item in obra" });
  }
}

export async function removeItemFromObraHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    await itemService.removeItemFromObra(request.params.id, prisma);
    return reply.code(204).send();
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "Error removing item from obra" });
  }
}

export async function getItemsByObraHandler(
  request: FastifyRequest<{
    Params: {
      obraId: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const items = await itemService.getItemsByObra(
      request.params.obraId,
      prisma
    );
    return reply.code(200).send(items);
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "Error fetching items for obra" });
  }
}

export async function getObrasByItemHandler(
  request: FastifyRequest<{
    Params: {
      itemId: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const obras = await itemService.getObrasByItem(
      request.params.itemId,
      prisma
    );
    return reply.code(200).send(obras);
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "Error fetching obras for item" });
  }
}
