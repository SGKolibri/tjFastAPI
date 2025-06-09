import { FastifyReply, FastifyRequest } from "fastify";
import {
  MaterialInput,
  MaterialObraInput,
  RegisterMaterialInput,
} from "./material.schema";
import * as MaterialService from "./material.services";

export async function registerMaterialHandler(
  request: FastifyRequest<{
    Body: RegisterMaterialInput;
  }>,
  reply: FastifyReply
) {
  try {
    const Material = await MaterialService.createMaterial(request.body);
    return reply.code(201).send(Material);
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "Error creating Material" });
  }
}

export async function getMaterialsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const Materials = await MaterialService.getMaterials();
    return reply.code(200).send(Materials);
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "Error fetching Materials" });
  }
}

export async function getMaterialHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const Material = await MaterialService.getMaterialById(request.params.id);

    if (!Material) {
      return reply.code(404).send({ message: "Material not found" });
    }

    return reply.code(200).send(Material);
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "Error fetching Material" });
  }
}

export async function updateMaterialHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
    Body: MaterialInput;
  }>,
  reply: FastifyReply
) {
  try {
    const Material = await MaterialService.updateMaterial(
      request.params.id,
      request.body
    );

    return reply.code(200).send(Material);
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "Error updating Material" });
  }
}

export async function deleteMaterialHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    await MaterialService.deleteMaterial(request.params.id);
    return reply.code(204).send();
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "Error deleting Material" });
  }
}

// Controllers for Material-obra relationship
export async function assignMaterialToObraHandler(
  request: FastifyRequest<{
    Body: MaterialObraInput;
  }>,
  reply: FastifyReply
) {
  try {
    const MaterialObra = await MaterialService.assignMaterialToObra(
      request.body
    );
    return reply.code(201).send(MaterialObra);
  } catch (e) {
    console.error(e);
    return reply
      .code(500)
      .send({ message: "Error assigning Material to obra" });
  }
}

export async function updateMaterialInObraHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
    Body: Partial<MaterialObraInput>;
  }>,
  reply: FastifyReply
) {
  try {
    const MaterialObra = await MaterialService.updateMaterialInObra(
      request.params.id,
      request.body
    );

    return reply.code(200).send(MaterialObra);
  } catch (e) {
    console.error(e);
    return reply.code(500).send({ message: "Error updating Material in obra" });
  }
}

export async function removeMaterialFromObraHandler(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    await MaterialService.removeMaterialFromObra(request.params.id);
    return reply.code(204).send();
  } catch (e) {
    console.error(e);
    return reply
      .code(500)
      .send({ message: "Error removing Material from obra" });
  }
}

export async function getMaterialsByObraHandler(
  request: FastifyRequest<{
    Params: {
      obraId: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const Materials = await MaterialService.getMaterialsByObra(
      request.params.obraId
    );
    return reply.code(200).send(Materials);
  } catch (e) {
    console.error(e);
    return reply
      .code(500)
      .send({ message: "Error fetching Materials for obra" });
  }
}

export async function getObrasByMaterialHandler(
  request: FastifyRequest<{
    Params: {
      MaterialId: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const obras = await MaterialService.getObrasByMaterial(
      request.params.MaterialId
    );
    return reply.code(200).send(obras);
  } catch (e) {
    console.error(e);
    return reply
      .code(500)
      .send({ message: "Error fetching obras for Material" });
  }
}
