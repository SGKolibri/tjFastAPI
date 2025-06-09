/*
  Warnings:

  - You are about to drop the `ItemObra` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ItemObra" DROP CONSTRAINT "ItemObra_materialId_fkey";

-- DropForeignKey
ALTER TABLE "ItemObra" DROP CONSTRAINT "ItemObra_obraId_fkey";

-- DropTable
DROP TABLE "ItemObra";

-- CreateTable
CREATE TABLE "MaterialObra" (
    "id" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "valorTotal" DOUBLE PRECISION,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaterialObra_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MaterialObra_materialId_obraId_key" ON "MaterialObra"("materialId", "obraId");

-- AddForeignKey
ALTER TABLE "MaterialObra" ADD CONSTRAINT "MaterialObra_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialObra" ADD CONSTRAINT "MaterialObra_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;
