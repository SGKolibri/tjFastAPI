import prisma from "../../utils/prisma";
import { CreateCompanyInput } from "./company.schemas";

export async function createCompany(input: CreateCompanyInput) {
  const { name, works } = input;

  const company = await prisma.company.create({
    data: { name, works: { create: works.map((work) => ({ name: work })) } },
  });
}
