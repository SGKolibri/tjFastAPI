-- DropIndex
DROP INDEX "TabelaFuncionarios_ano_key";

-- AlterTable
ALTER TABLE "_FuncionarioTabelaFuncionarios" ADD CONSTRAINT "_FuncionarioTabelaFuncionarios_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_FuncionarioTabelaFuncionarios_AB_unique";
