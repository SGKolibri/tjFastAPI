import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

// Funcionario schema is a class that extends the Prisma Funcionario model
const beneficiosSchema = z.object({
  cafe: z.number().optional(),
  almoco: z.number().optional(),
  passagem: z.number().optional(),
});

const salarioSchema = z.object({
  mes: z.number().min(1).max(12), // Validação para mês válido
  ano: z.number().int().min(2000).max(2100), // Validação para ano válido
  base: z.number(), // Salário base
  horasExtras: z.number().optional(),
  descontos: z.number().optional(),
  faltas: z.number().optional(),
  extras: z.number().optional(),
  bonus: z.number().optional(),
  total: z.number(),
  beneficios: beneficiosSchema.optional(),
});

const funcionarioCore = {
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  cargo: z.string({
    required_error: "Cargo is required",
    invalid_type_error: "Cargo must be a string",
  }),
  chavePix: z.string({
    required_error: "ChavePix is required",
    invalid_type_error: "ChavePix must be a string",
  }),
  banco: z.string({
    required_error: "Banco is required",
    invalid_type_error: "Banco must be a string",
  }),
  contato: z.string({
    required_error: "Contato is required",
    invalid_type_error: "Contato must be a string",
  }),
  cpf: z.string({
    required_error: "CPF is required",
    invalid_type_error: "CPF must be a string",
  }),
  salarios: z.array(salarioSchema).optional(),
};

const createFuncionarioSchema = z.object({
  ...funcionarioCore,
});

const createFuncionarioResponseSchema = z.object({
  id: z.string(),
  ...funcionarioCore,
});

const FuncionarioResponseSchema = z.object({
  id: z.string(),
  ...funcionarioCore,
});

export type CreateFuncionarioInput = z.infer<typeof createFuncionarioSchema>;
export type GetFuncionarioByInput = z.infer<typeof FuncionarioResponseSchema>;

export const { schemas: funcionarioSchemas, $ref } = buildJsonSchemas(
  {
    createFuncionarioSchema,
    createFuncionarioResponseSchema,
  },
  { $id: "funcionarioSchema" }
);
