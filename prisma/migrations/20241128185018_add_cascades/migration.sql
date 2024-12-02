-- DropForeignKey
ALTER TABLE "Beneficio" DROP CONSTRAINT "Beneficio_salarioMensalId_fkey";

-- DropForeignKey
ALTER TABLE "SalarioMensal" DROP CONSTRAINT "SalarioMensal_funcionarioId_fkey";

-- AddForeignKey
ALTER TABLE "SalarioMensal" ADD CONSTRAINT "SalarioMensal_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Funcionario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficio" ADD CONSTRAINT "Beneficio_salarioMensalId_fkey" FOREIGN KEY ("salarioMensalId") REFERENCES "SalarioMensal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
