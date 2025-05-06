/*
  Warnings:

  - Added the required column `funcionarioId` to the `Obra` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ObraStatus" AS ENUM ('PLANEJAMENTO', 'EM_ANDAMENTO', 'PAUSADA', 'CONCLUIDA', 'CANCELADA');

-- AlterTable
ALTER TABLE "Obra" ADD COLUMN     "funcionarioId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PLANEJAMENTO';

-- AddForeignKey
ALTER TABLE "Obra" ADD CONSTRAINT "Obra_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Funcionario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
