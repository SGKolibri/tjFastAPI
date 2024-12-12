/*
  Warnings:

  - A unique constraint covering the columns `[anomes]` on the table `TabelaFuncionarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `anomes` to the `TabelaFuncionarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TabelaFuncionarios" ADD COLUMN     "anomes" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TabelaFuncionarios_anomes_key" ON "TabelaFuncionarios"("anomes");
