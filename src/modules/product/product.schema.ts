// schema handles the validation of the application

import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const productInput = {
  title: z.string(),
  content: z.string(),
  price: z.number(),
};

const productGenerated = {
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
};

const createProductSchema = z.object({
  title: z.string(),
  content: z.string(),
  price: z.number(),
});

const productResponseSchema = z.object({
  ...productGenerated,
  ...productInput,
  owner: z.object({
    id: z.number(),
    email: z.string(),
    name: z.string(),
  }),
});

const productsResponseSchema = z.array(productResponseSchema);

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type GetProductsInput = z.infer<typeof productsResponseSchema>;
export type GetProductByIdInput = z.infer<typeof productResponseSchema>;

// export both the schemas and the $ref because we will use them in the route
// $ref is used to reference the schema in the route
export const { schemas: productSchemas, $ref } = buildJsonSchemas(
  {
    createProductSchema,
    productResponseSchema,
    productsResponseSchema,
  },
  { $id: "ProductSchema" }
);
