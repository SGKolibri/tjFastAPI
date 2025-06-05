import { ProfessionalPDFGenerator } from "../../../utils/pdfUtils";

export function generateFuncionarioReport(
  dados: any[],
  generator: ProfessionalPDFGenerator
) {
  // Estatísticas gerais

  console.log(
    "Salário dos funcionários:",
    dados.map((f) => f.salarios)
  );

  const totalFuncionarios = dados.length;
  const funcionariosAtivos = dados.filter((f) => f.status).length;
  const funcionariosInativos = totalFuncionarios - funcionariosAtivos;

  // Calcular estatísticas salariais
  const todosSalarios = dados.flatMap((f) => f.salarios || []);
  const mediaSalarial =
    todosSalarios.length > 0
      ? todosSalarios.reduce((acc, s) => acc + (s.salarioBase || 0), 0) /
        todosSalarios.length
      : 0;
  const maiorSalario =
    todosSalarios.length > 0
      ? Math.max(...todosSalarios.map((s) => s.salarioBase || 0))
      : 0;

  // Seção de resumo executivo
  // generator.addSection("Resumo Executivo");

  // Cards de estatísticas
  // generator.addSummaryCard(
  //   "Total de Funcionários",
  //   totalFuncionarios.toString()
  // );
  // generator.addSummaryCard(
  //   "Funcionários Ativos",
  //   funcionariosAtivos.toString(),
  //   `${((funcionariosAtivos / totalFuncionarios) * 100).toFixed(1)}%`
  // );
  // generator.addSummaryCard(
  //   "Média Salarial",
  //   `R$ ${mediaSalarial.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
  // );

  // Distribuição por cargo
  // const cargoDistribution = dados.reduce((acc, func) => {
  //   const cargo = func.cargo?.nome || "Sem Cargo";
  //   acc[cargo] = (acc[cargo] || 0) + 1;
  //   return acc;
  // }, {});

  // const chartData = Object.entries(cargoDistribution).map(([label, value]) => ({
  //   label,
  //   value: value as number,
  //   color: getColorForCargo(label),
  // }));

  // generator.addChart("Distribuição por Cargo", chartData);

  // Detalhamento individual dos funcionários
  // generator.addSection("Detalhamento dos Funcionários");

  dados.forEach((funcionario, index) => {
    // addFuncionarioDetails(generator, funcionario, index + 1);
    generator.addFuncionarioSection(funcionario, index + 1);
  });
}

// function addFuncionarioDetails(
//   generator: ProfessionalPDFGenerator,
//   funcionario: any,
//   numero: number
// ) {
//   // Cabeçalho do funcionário
//   generator.addFuncionarioHeader(
//     `${numero}. ${funcionario.name || "Nome não informado"}`,
//     funcionario.status ? "Ativo" : "Inativo"
//   );

//   // Informações básicas em formato de card
//   const infoBasica = [
//     ["Cargo", funcionario.cargo?.nome || "Não atribuído"],
//     ["CPF", funcionario.cpf || "Não informado"],
//     ["Contato", funcionario.contato || "Não informado"],
//     ["Banco", funcionario.banco || "Não informado"],
//     ["Chave PIX", funcionario.chavePix || "Não informado"],
//   ];

//   generator.addInfoTable(infoBasica);

//   // Histórico salarial se disponível
//   if (funcionario.salarios && funcionario.salarios.length > 0) {
//     generator.addSalaryHistory(funcionario.salarios);
//   } else {
//     generator.addNoSalaryInfo();
//   }

//   // Separador entre funcionários
//   generator.addDivider();
// }

// function getColorForCargo(cargo: string): string {
//   const colors = [
//     "#e74c3c",
//     "#3498db",
//     "#2ecc71",
//     "#f39c12",
//     "#9b59b6",
//     "#1abc9c",
//     "#e67e22",
//     "#34495e",
//   ];
//   let hash = 0;
//   for (let i = 0; i < cargo.length; i++) {
//     hash = cargo.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   return colors[Math.abs(hash) % colors.length];
// }
