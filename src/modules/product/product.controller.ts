// controllers to use the services to perform operations on the database.

import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateProductInput,
  GetProductsInput,
  GetProductByIdInput,
} from "./product.schema";
import {
  createProduct,
  deleteProductById,
  getProductById,
  getProducts,
} from "./product.services";

export async function createProductHandler(
  request: FastifyRequest<{ Body: CreateProductInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const product = await createProduct({ ...body, ownerId: request.user.id });
    return reply.status(201).send(product);
  } catch (e) {
    console.log(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

export async function getProductsHandler(
  request: FastifyRequest<{ Body: GetProductsInput }>,
  reply: FastifyReply
) {
  try {
    const products = await getProducts();
    return reply.send(products);
  } catch (e) {
    console.log(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

export async function getProductByIdHandler(
  request: FastifyRequest<{ Params: GetProductByIdInput }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  try {
    const product = await getProductById(Number(id));
    return reply.send(product);
  } catch (e) {
    console.log(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

export async function deleteProductByIdHandler(
  request: FastifyRequest<{ Params: GetProductByIdInput }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  const product = await getProductById(Number(id));
  if (!product) {
    return reply.status(404).send({ message: "Product not found" });
  }

  try {
    await deleteProductById(Number(id));
    return reply
      .status(200)
      .send({
        message: "Product deleted successfully",
        deletedProduct: product,
      });
  } catch (e) {
    console.log(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}
