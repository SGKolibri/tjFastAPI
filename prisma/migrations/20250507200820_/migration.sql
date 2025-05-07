/*
  Warnings:

  - You are about to drop the column `obrasIDs` on the `Funcionario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Funcionario" DROP COLUMN "obrasIDs";

-- CreateTable
CREATE TABLE "_FuncionarioToObra" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FuncionarioToObra_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FuncionarioToObra_B_index" ON "_FuncionarioToObra"("B");

-- AddForeignKey
ALTER TABLE "_FuncionarioToObra" ADD CONSTRAINT "_FuncionarioToObra_A_fkey" FOREIGN KEY ("A") REFERENCES "Funcionario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FuncionarioToObra" ADD CONSTRAINT "_FuncionarioToObra_B_fkey" FOREIGN KEY ("B") REFERENCES "Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;
