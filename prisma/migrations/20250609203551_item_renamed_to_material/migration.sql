/*
  Warnings:

  - You are about to drop the column `itemId` on the `ItemObra` table. All the data in the column will be lost.
  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[materialId,obraId]` on the table `ItemObra` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `materialId` to the `ItemObra` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ItemObra" DROP CONSTRAINT "ItemObra_itemId_fkey";

-- DropIndex
DROP INDEX "ItemObra_itemId_obraId_key";

-- AlterTable
ALTER TABLE "ItemObra" DROP COLUMN "itemId",
ADD COLUMN     "materialId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Item";

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "categoria" TEXT NOT NULL,
    "unidade" TEXT NOT NULL,
    "precoUnitario" DOUBLE PRECISION NOT NULL,
    "fornecedor" TEXT,
    "codigo" TEXT,
    "quantidade" DOUBLE PRECISION,
    "status" TEXT,
    "localizacao" TEXT,
    "dataCompra" TIMESTAMP(3),
    "dataEntrega" TIMESTAMP(3),
    "numeroNota" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemObra_materialId_obraId_key" ON "ItemObra"("materialId", "obraId");

-- AddForeignKey
ALTER TABLE "ItemObra" ADD CONSTRAINT "ItemObra_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;
