import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

// name of the company and works, an array of works that the company has done
const CreateCompanySchema = z.object({
  name: z.string(),
  works: z.array(z.string()),
});

export type CreateCompanyInput = z.infer<typeof CreateCompanySchema>;

export const { schemas: companySchemas, $ref } = buildJsonSchemas(
  {
    CreateCompanySchema,
  },
  { $id: "CompanySchema" }
);
