import { ProfessionalPDFGenerator } from "../../../utils/pdfUtils";

export function generateCargoReport(
  dados: any[],
  generator: ProfessionalPDFGenerator
) {
  generator.addSection("Relatório de Cargos");

  const totalCargos = dados.length;
  const cargosComFuncionarios = dados.filter(
    (c) => c.Funcionario && c.Funcionario.length > 0
  ).length;

  generator.addSummaryCard("Total de Cargos", totalCargos.toString());
  generator.addSummaryCard("Cargos Ocupados", cargosComFuncionarios.toString());
  generator.addSummaryCard(
    "Cargos Vagos",
    (totalCargos - cargosComFuncionarios).toString()
  );

  const headers = ["Cargo", "Descrição", "Funcionários", "Salário Base"];
  const rows = dados.map((cargo) => [
    cargo.nome || "N/A",
    cargo.descricao || "N/A",
    cargo.Funcionario?.length?.toString() || "0",
    cargo.salarioBase ? `R$ ${cargo.salarioBase.toFixed(2)}` : "N/A",
  ]);

  generator.addTable(headers, rows);
}
