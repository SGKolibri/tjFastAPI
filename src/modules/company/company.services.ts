import prisma from "../../utils/prisma";
import { CreateCompanyInput } from "./company.schemas";

export async function createCompany(input: CreateCompanyInput) {
  const { name, works } = input;

  console.log("works", works);
}
