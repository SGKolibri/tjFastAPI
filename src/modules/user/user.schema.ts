import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

// user schema is a class that extends the Prisma User model
const userCore = {
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  name: z.string(),
};

const createUserSchema = z.object({
  ...userCore,
  // password: z
  //   .string({
  //     required_error: "Password is required",
  //     invalid_type_error: "Password must be at least 6 characters",
  //   })
  //   .min(6),
});

const createUserResponseSchema = z.object({
  id: z.number(),
  ...userCore,
});

// const loginUserSchema = z.object({
//   email: z
//     .string({
//       required_error: "Email is required",
//       invalid_type_error: "Email must be a string",
//     })
//     .email(),
//   password: z.string(),
// });

// const loginUserResponseSchema = z.object({
//   accessToken: z.string(),
//   user: z.object({
//     id: z.number(),
//     ...userCore,
//   }),
// });

const userResponseSchema = z.object({
  id: z.number(),
  ...userCore,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
// export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type GetUserByInput = z.infer<typeof userResponseSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    createUserSchema,
    createUserResponseSchema,
    // loginUserSchema,
    // loginUserResponseSchema,
  },
  { $id: "UserSchema" }
);
