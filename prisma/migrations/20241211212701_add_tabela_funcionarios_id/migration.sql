-- AlterTable
ALTER TABLE "Funcionario" ADD COLUMN     "tabelaFuncionariosId" TEXT;

-- CreateTable
CREATE TABLE "TabelaFuncionarios" (
    "id" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TabelaFuncionarios_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Funcionario" ADD CONSTRAINT "Funcionario_tabelaFuncionariosId_fkey" FOREIGN KEY ("tabelaFuncionariosId") REFERENCES "TabelaFuncionarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
