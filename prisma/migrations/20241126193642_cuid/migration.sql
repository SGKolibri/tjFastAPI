/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Agenda` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Beneficio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Evento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Funcionario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SalarioMensal` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Beneficio" DROP CONSTRAINT "Beneficio_salarioMensalId_fkey";

-- DropForeignKey
ALTER TABLE "Evento" DROP CONSTRAINT "Evento_agendaId_fkey";

-- DropForeignKey
ALTER TABLE "SalarioMensal" DROP CONSTRAINT "SalarioMensal_funcionarioId_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Admin_id_seq";

-- AlterTable
ALTER TABLE "Agenda" DROP CONSTRAINT "Agenda_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Agenda_id_seq";

-- AlterTable
ALTER TABLE "Beneficio" DROP CONSTRAINT "Beneficio_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "salarioMensalId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Beneficio_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Beneficio_id_seq";

-- AlterTable
ALTER TABLE "Evento" DROP CONSTRAINT "Evento_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "agendaId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Evento_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Evento_id_seq";

-- AlterTable
ALTER TABLE "Funcionario" DROP CONSTRAINT "Funcionario_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Funcionario_id_seq";

-- AlterTable
ALTER TABLE "SalarioMensal" DROP CONSTRAINT "SalarioMensal_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "funcionarioId" SET DATA TYPE TEXT,
ADD CONSTRAINT "SalarioMensal_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SalarioMensal_id_seq";

-- AddForeignKey
ALTER TABLE "SalarioMensal" ADD CONSTRAINT "SalarioMensal_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Funcionario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficio" ADD CONSTRAINT "Beneficio_salarioMensalId_fkey" FOREIGN KEY ("salarioMensalId") REFERENCES "SalarioMensal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_agendaId_fkey" FOREIGN KEY ("agendaId") REFERENCES "Agenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
