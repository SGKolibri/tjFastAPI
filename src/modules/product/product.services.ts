/* 
 services handle the business logic of the application.
 They are responsible for interacting with the database, 
 making API calls, and enforcing business rules. 
 In this case, the services are responsible for 
 creating, finding, and updating products in the database. 
 The services are called by the controllers to perform these operations. 
*/

import prisma from "../../utils/prisma";
import { CreateProductInput } from "./product.schema";

export async function createProduct(
  data: CreateProductInput & { ownerId: number }
) {
  return prisma.product.create({
    data,
    // include the owner information in the response
    include: {
      owner: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });
}

export async function getProducts() {
  return prisma.product.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      price: true,
      createdAt: true,
      updatedAt: true,
      owner: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });
}

export async function getProductById(id: number) {
  return prisma.product.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      price: true,
      createdAt: true,
      updatedAt: true,
      owner: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });
}

export async function deleteProductById(id: number) {
  return prisma.product.delete({
    where: {
      id,
    },
  });
}
