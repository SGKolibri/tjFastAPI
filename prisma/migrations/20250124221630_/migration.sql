/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Funcionario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_FuncionarioTabelaFuncionarios` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "SalarioMensal" DROP CONSTRAINT "SalarioMensal_funcionarioId_fkey";

-- DropForeignKey
ALTER TABLE "_FuncionarioTabelaFuncionarios" DROP CONSTRAINT "_FuncionarioTabelaFuncionarios_A_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Admin_id_seq";

-- AlterTable
ALTER TABLE "Funcionario" DROP CONSTRAINT "Funcionario_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Funcionario_id_seq";

-- AlterTable
ALTER TABLE "SalarioMensal" ALTER COLUMN "funcionarioId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_FuncionarioTabelaFuncionarios" DROP CONSTRAINT "_FuncionarioTabelaFuncionarios_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ADD CONSTRAINT "_FuncionarioTabelaFuncionarios_AB_pkey" PRIMARY KEY ("A", "B");

-- AddForeignKey
ALTER TABLE "SalarioMensal" ADD CONSTRAINT "SalarioMensal_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Funcionario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FuncionarioTabelaFuncionarios" ADD CONSTRAINT "_FuncionarioTabelaFuncionarios_A_fkey" FOREIGN KEY ("A") REFERENCES "Funcionario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
