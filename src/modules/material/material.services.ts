import prisma from "../../utils/prisma";
import {
  MaterialInput,
  MaterialObraInput,
  RegisterMaterialInput,
} from "./material.schema";

export async function createMaterial(input: RegisterMaterialInput) {
  console.log("Creating Material...");
  console.log("Input Data:", input);

  const { projetos, ...materialData } = input;

  const Material = await prisma.material.create({
    data: {
      nome: materialData.nome,
      descricao: materialData.descricao,
      categoria: materialData.categoria,
      unidade: materialData.unidade,
      precoUnitario: materialData.precoUnitario,
      fornecedor: materialData.fornecedor,
      codigo: materialData.codigo,
      quantidade: materialData.quantidade,
      status: materialData.status,
      localizacao: materialData.localizacao,
      numeroNota: materialData.numeroNota,
      // Properly handle date fields
      dataCompra: materialData.dataCompra
        ? new Date(materialData.dataCompra)
        : null,
      dataEntrega: materialData.dataEntrega
        ? new Date(materialData.dataEntrega)
        : null,
      // Handle relationships
      obras: projetos?.length
        ? {
            create: projetos.map((obraId) => ({
              obraId,
              quantidade: materialData.quantidade || 0,
              valorTotal:
                (materialData.quantidade || 0) * materialData.precoUnitario,
            })),
          }
        : undefined,
    },
    include: {
      obras: {
        include: {
          obra: true,
        },
      },
    },
  });

  return Material;
}

export async function getMaterials() {
  console.log("Fetching Materials...");
  return prisma.material.findMany({
    orderBy: {
      nome: "asc",
    },
  });
}

export async function getMaterialById(id: string) {
  return prisma.material.findUnique({
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

export async function updateMaterial(id: string, data: MaterialInput) {
  return prisma.material.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteMaterial(id: string) {
  return prisma.material.delete({
    where: {
      id,
    },
  });
}

// Functions to handle the relationship between Materials and obras
export async function assignMaterialToObra(input: MaterialObraInput) {
  const { materialId, obraId, quantidade, valorTotal, observacoes } = input;

  // Calculate valorTotal if not provided
  let finalValorTotal = valorTotal;
  if (!valorTotal) {
    const Material = await prisma.material.findUnique({
      where: { id: materialId },
    });

    if (Material) {
      finalValorTotal = Material.precoUnitario * quantidade;
    }
  }

  return prisma.materialObra.create({
    data: {
      materialId,
      obraId,
      quantidade,
      valorTotal: finalValorTotal,
      observacoes,
    },
    include: {
      material: true,
      obra: true,
    },
  });
}

export async function updateMaterialInObra(
  id: string,
  input: Partial<MaterialObraInput>
) {
  const { quantidade } = input;

  // Calculate new valorTotal if quantidade changes
  let data: any = { ...input };

  if (quantidade) {
    const MaterialObra = await prisma.materialObra.findUnique({
      where: { id },
      include: { material: true },
    });

    if (MaterialObra && MaterialObra.material) {
      data.valorTotal = MaterialObra.material.precoUnitario * quantidade;
    }
  }

  return prisma.materialObra.update({
    where: { id },
    data,
    include: {
      material: true,
      obra: true,
    },
  });
}

export async function removeMaterialFromObra(id: string) {
  return prisma.materialObra.delete({
    where: { id },
  });
}

export async function getMaterialsByObra(obraId: string) {
  return prisma.materialObra.findMany({
    where: {
      obraId,
    },
    include: {
      material: true,
    },
    orderBy: {
      material: {
        nome: "asc",
      },
    },
  });
}

export async function getObrasByMaterial(MaterialId: string) {
  return prisma.materialObra.findMany({
    where: {
      materialId: MaterialId,
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
