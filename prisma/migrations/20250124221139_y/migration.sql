/*
  Warnings:

  - The primary key for the `Beneficio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Cargo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Evento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SalarioMensal` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TabelaFuncionarios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_FuncionarioTabelaFuncionarios` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Beneficio" DROP CONSTRAINT "Beneficio_salarioMensalId_fkey";

-- DropForeignKey
ALTER TABLE "Funcionario" DROP CONSTRAINT "Funcionario_cargoId_fkey";

-- DropForeignKey
ALTER TABLE "_FuncionarioTabelaFuncionarios" DROP CONSTRAINT "_FuncionarioTabelaFuncionarios_B_fkey";

-- DropIndex
DROP INDEX "Funcionario_cpf_key";

-- AlterTable
ALTER TABLE "Beneficio" DROP CONSTRAINT "Beneficio_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "salarioMensalId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Beneficio_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Beneficio_id_seq";

-- AlterTable
ALTER TABLE "Cargo" DROP CONSTRAINT "Cargo_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Cargo_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Cargo_id_seq";

-- AlterTable
ALTER TABLE "Evento" DROP CONSTRAINT "Evento_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Evento_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Evento_id_seq";

-- AlterTable
ALTER TABLE "Funcionario" ALTER COLUMN "cargoId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "SalarioMensal" DROP CONSTRAINT "SalarioMensal_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "SalarioMensal_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SalarioMensal_id_seq";

-- AlterTable
ALTER TABLE "TabelaFuncionarios" DROP CONSTRAINT "TabelaFuncionarios_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TabelaFuncionarios_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TabelaFuncionarios_id_seq";

-- AlterTable
ALTER TABLE "_FuncionarioTabelaFuncionarios" DROP CONSTRAINT "_FuncionarioTabelaFuncionarios_AB_pkey",
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_FuncionarioTabelaFuncionarios_AB_pkey" PRIMARY KEY ("A", "B");

-- AddForeignKey
ALTER TABLE "Funcionario" ADD CONSTRAINT "Funcionario_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES "Cargo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficio" ADD CONSTRAINT "Beneficio_salarioMensalId_fkey" FOREIGN KEY ("salarioMensalId") REFERENCES "SalarioMensal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FuncionarioTabelaFuncionarios" ADD CONSTRAINT "_FuncionarioTabelaFuncionarios_B_fkey" FOREIGN KEY ("B") REFERENCES "TabelaFuncionarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
