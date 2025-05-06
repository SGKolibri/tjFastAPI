/*
  Warnings:

  - You are about to drop the `_FuncionarioObra` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FuncionarioObra" DROP CONSTRAINT "_FuncionarioObra_A_fkey";

-- DropForeignKey
ALTER TABLE "_FuncionarioObra" DROP CONSTRAINT "_FuncionarioObra_B_fkey";

-- AlterTable
ALTER TABLE "Funcionario" ADD COLUMN     "obrasIDs" TEXT[];

-- DropTable
DROP TABLE "_FuncionarioObra";
