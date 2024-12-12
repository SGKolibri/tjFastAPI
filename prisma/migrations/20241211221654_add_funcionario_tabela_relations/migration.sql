/*
  Warnings:

  - You are about to drop the column `tabelaFuncionariosId` on the `Funcionario` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Funcionario" DROP CONSTRAINT "Funcionario_tabelaFuncionariosId_fkey";

-- AlterTable
ALTER TABLE "Funcionario" DROP COLUMN "tabelaFuncionariosId";

-- CreateTable
CREATE TABLE "_FuncionarioTabelaFuncionarios" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FuncionarioTabelaFuncionarios_AB_unique" ON "_FuncionarioTabelaFuncionarios"("A", "B");

-- CreateIndex
CREATE INDEX "_FuncionarioTabelaFuncionarios_B_index" ON "_FuncionarioTabelaFuncionarios"("B");

-- AddForeignKey
ALTER TABLE "_FuncionarioTabelaFuncionarios" ADD CONSTRAINT "_FuncionarioTabelaFuncionarios_A_fkey" FOREIGN KEY ("A") REFERENCES "Funcionario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FuncionarioTabelaFuncionarios" ADD CONSTRAINT "_FuncionarioTabelaFuncionarios_B_fkey" FOREIGN KEY ("B") REFERENCES "TabelaFuncionarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
