/*
  Warnings:

  - A unique constraint covering the columns `[ano]` on the table `TabelaFuncionarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ano` to the `TabelaFuncionarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TabelaFuncionarios" ADD COLUMN     "ano" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TabelaFuncionarios_ano_key" ON "TabelaFuncionarios"("ano");
