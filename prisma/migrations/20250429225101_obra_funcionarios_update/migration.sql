/*
  Warnings:

  - You are about to drop the column `funcionarioId` on the `Obra` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Obra" DROP CONSTRAINT "Obra_funcionarioId_fkey";

-- AlterTable
ALTER TABLE "Obra" DROP COLUMN "funcionarioId";

-- CreateTable
CREATE TABLE "_FuncionarioObra" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FuncionarioObra_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FuncionarioObra_B_index" ON "_FuncionarioObra"("B");

-- AddForeignKey
ALTER TABLE "_FuncionarioObra" ADD CONSTRAINT "_FuncionarioObra_A_fkey" FOREIGN KEY ("A") REFERENCES "Funcionario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FuncionarioObra" ADD CONSTRAINT "_FuncionarioObra_B_fkey" FOREIGN KEY ("B") REFERENCES "Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;
