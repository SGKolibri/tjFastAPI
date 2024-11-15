import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const creteAdminSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be at least 6 characters",
    })
    .min(6),
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
});

const createAdminResponseSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
});

const loginAdminSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  }),
});

const loginAdminResponseSchema = z.object({
  accessToken: z.string(),
  admin: z.object({
    id: z.number(),
    email: z.string(),
    name: z.string(),
  }),
});

export type CreateAdminInput = z.infer<typeof creteAdminSchema>;
export type LoginAdminInput = z.infer<typeof loginAdminSchema>;

export const { schemas: adminSchemas, $ref } = buildJsonSchemas(
  {
    creteAdminSchema,
    createAdminResponseSchema,
    loginAdminSchema,
    loginAdminResponseSchema,
  },
  { $id: "AdminSchema" }
);
