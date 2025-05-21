import prisma from "../../utils/prisma";
import { RelatorioRequest } from "./relatorio.schema";
import * as fs from "fs";
import * as path from "path";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

export async function gerarRelatorio(input: RelatorioRequest) {
  const { modulo, dataInicio, dataFim, formato, filtros } = input;
  const timestamp = new Date().toISOString().replace(/:/g, "-");
  const fileName = `relatorio_${modulo}_${timestamp}.${
    formato === "excel" ? "xlsx" : formato
  }`;
  const filePath = path.join(__dirname, "../../../public/relatorios", fileName);

  const baseUrl = process.env.BASE_URL || "http://localhost:4567";

  // Certifique-se de que o diretório existe
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Obter dados do módulo específico
  const dados = await obterDadosModulo(modulo, dataInicio, dataFim, filtros);

  // Gerar o relatório no formato especificado
  if (formato === "pdf") {
    await gerarPDF(dados, filePath, modulo);
  } else if (formato === "excel") {
    await gerarExcel(dados, filePath, modulo);
  } else {
    // JSON
    fs.writeFileSync(filePath, JSON.stringify(dados, null, 2));
  }

  // Retornar a URL para download do relatório
  return {
    url: `${baseUrl}/relatorios/${fileName}`,
    viewUrl: `${baseUrl}/api/relatorio/view/${fileName}`,
    geradoEm: new Date().toISOString(),
    modulo,
    formato,
  };
}

async function obterDadosModulo(
  modulo: string,
  dataInicio?: string,
  dataFim?: string,
  filtros?: Record<string, any>
) {
  switch (modulo) {
    case "funcionario":
      return prisma.funcionario.findMany({
        include: {
          cargo: true,
        },
      });
    case "cargo":
      return prisma.cargo.findMany({
        where: filtros || {},
        include: {
          Funcionario: true,
        },
      });
    case "item":
      return prisma.item.findMany({
        where: {
          ...(filtros || {}),
          ...(dataInicio && dataFim
            ? {
                createdAt: {
                  gte: new Date(dataInicio),
                  lte: new Date(dataFim),
                },
              }
            : {}),
        },
        include: {
          obras: {
            include: {
              obra: true,
            },
          },
        },
      });
    case "obra":
      return prisma.obra.findMany({
        where: {
          ...(filtros || {}),
          ...(dataInicio && dataFim
            ? {
                dataInicio: {
                  gte: new Date(dataInicio),
                },
                dataFim: {
                  lte: new Date(dataFim),
                },
              }
            : {}),
        },
        include: {
          itens: {
            include: {
              item: true,
            },
          },
          funcionarios: true,
        },
      });
    default:
      throw new Error(`Módulo ${modulo} não suportado`);
  }
}

async function gerarPDF(dados: any, filePath: string, modulo: string) {
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  // Adicionar cabeçalho
  doc
    .fontSize(25)
    .text(`Relatório de ${modulo.toUpperCase()}`, { align: "center" });
  doc.moveDown();
  doc
    .fontSize(12)
    .text(`Gerado em: ${new Date().toLocaleString()}`, { align: "center" });
  doc.moveDown(2);

  // Adicionar conteúdo específico para cada módulo
  switch (modulo) {
    case "funcionario":
      adicionarConteudoFuncionarioPDF(doc, dados);
      break;
    // case "cargo":
    //   adicionarConteudoCargoPDF(doc, dados);
    //   break;
    // case "item":
    //   adicionarConteudoItemPDF(doc, dados);
    //   break;
    // case "obra":
    //   adicionarConteudoObraPDF(doc, dados);
    //   break;
  }

  doc.end();

  return new Promise<void>((resolve) => {
    stream.on("finish", () => resolve());
  });
}

// Funções auxiliares para cada módulo - implementar de acordo com seus dados
function adicionarConteudoFuncionarioPDF(
  doc: PDFKit.PDFDocument,
  dados: any[]
) {
  doc.fontSize(16).text("Lista de Funcionários", { underline: true });
  doc.moveDown();

  dados.forEach((funcionario, index) => {
    doc.fontSize(14).text(`${index + 1}. ${funcionario.name}`);
    doc
      .fontSize(12)
      .text(`Cargo: ${funcionario.cargo?.nome || "Não atribuído"}`);
    doc.fontSize(12).text(`E-mail: ${funcionario.email}`);
    doc
      .fontSize(12)
      .text(`Telefone: ${funcionario.telefone || "Não informado"}`);
    doc.moveDown();
  });
}

// Implementar funções similares para outros módulos
// function adicionarConteudoCargoPDF(...) { ... }
// function adicionarConteudoItemPDF(...) { ... }
// function adicionarConteudoObraPDF(...) { ... }

async function gerarExcel(dados: any, filePath: string, modulo: string) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`Relatório de ${modulo}`);

  // Definir cabeçalhos específicos para cada módulo
  switch (modulo) {
    case "funcionario":
      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Nome", key: "nome", width: 30 },
        { header: "Email", key: "email", width: 30 },
        { header: "Cargo", key: "cargoNome", width: 20 },
        { header: "Telefone", key: "telefone", width: 20 },
      ];

      // Adicionar dados
      dados.forEach((funcionario: any) => {
        worksheet.addRow({
          id: funcionario.id,
          nome: funcionario.nome,
          email: funcionario.email,
          cargoNome: funcionario.cargo?.nome || "Não atribuído",
          telefone: funcionario.telefone || "Não informado",
        });
      });
      break;

    // Implementar casos para outros módulos
    // case "cargo": ...
    // case "item": ...
    // case "obra": ...
  }

  await workbook.xlsx.writeFile(filePath);
}
