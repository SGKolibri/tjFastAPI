import prisma from "../../utils/prisma";
import { RelatorioRequest } from "./relatorio.schema";
import * as fs from "fs";
import * as path from "path";
import PDFDocument from "pdfkit";
import { promisify } from "util";
import { ProfessionalPDFGenerator } from "../../utils/pdfUtils";
import { generateFuncionarioReport } from "./generator/funcionarioReportGenerator";
import { generateCargoReport } from "./generator/cargoReportGenerator";
// import ExcelJS from "exceljs";

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);

const RELATORIOS_DIR = path.join(process.cwd(), "public/relatorios");
const DIAS_PARA_MANTER = 7;
const MAX_FILES = 50;

export async function gerarRelatorio(input: RelatorioRequest) {
  const { modulo, dataInicio, dataFim, formato, filtros } = input;
  const timestamp = new Date().toISOString().replace(/:/g, "-");
  const fileName = `relatorio_${modulo}_${timestamp}.${formato}`;
  const filePath = path.join(process.cwd(), "public/relatorios", fileName);

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
          salarios: {
            include: {
              beneficios: true,
            },
          },
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
  try {
    console.log(
      `Iniciando geração de PDF para ${modulo} com ${dados.length} registros`
    );

    console.log("DADOS RECEBIDOS:", dados);

    if (dados.length > 500) {
      console.warn(
        `Limitando relatório a 500 registros de ${dados.length} totais`
      );
      dados = dados.slice(0, 500);
    }

    const config = {
      title: `Relatório de ${modulo.charAt(0).toUpperCase() + modulo.slice(1)}`,
    };

    const generator = new ProfessionalPDFGenerator(config);
    const stream = fs.createWriteStream(filePath);
    generator.pipe(stream);

    switch (modulo) {
      case "funcionario":
        generateFuncionarioReport(dados, generator);
        break;
      case "cargo":
        generateCargoReport(dados, generator);
        break;
      case "default":
        console.warn(`Módulo ${modulo} não implementado para PDF`);
        generator.addSection("Módulo não implementado");
        break;
    }

    generator.end();

    return new Promise<void>((resolve, reject) => {
      let resolved = false;

      stream.on("finish", () => {
        console.log(`PDF gerado com sucesso: ${filePath}`);
        if (!resolved) {
          resolved = true;
          resolve();
        }
      });

      stream.on("error", (err) => {
        console.error(`Erro na geração do stream PDF: ${err}`);
        if (!resolved) {
          resolved = true;
          reject(err);
        }
      });

      setTimeout(() => {
        if (!resolved) {
          console.warn("Timeout na geração do PDF após 20s");
          resolved = true;
          resolve();
        }
      }, 20000);
    });
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw error;
  }
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
// async function gerarExcel(dados: any, filePath: string, modulo: string) {
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet(`Relatório de ${modulo}`);

//   // Definir cabeçalhos específicos para cada módulo
//   switch (modulo) {
//     case "funcionario":
//       worksheet.columns = [
//         { header: "ID", key: "id", width: 10 },
//         { header: "Nome", key: "nome", width: 30 },
//         { header: "Email", key: "email", width: 30 },
//         { header: "Cargo", key: "cargoNome", width: 20 },
//         { header: "Telefone", key: "telefone", width: 20 },
//       ];

//       // Adicionar dados
//       dados.forEach((funcionario: any) => {
//         worksheet.addRow({
//           id: funcionario.id,
//           nome: funcionario.nome,
//           email: funcionario.email,
//           cargoNome: funcionario.cargo?.nome || "Não atribuído",
//           telefone: funcionario.telefone || "Não informado",
//         });
//       });
//       break;

//     // Implementar casos para outros módulos
//     // case "cargo": ...
//     // case "item": ...
//     // case "obra": ...
//   }

//   await workbook.xlsx.writeFile(filePath);
// }

/**
 * Remove relatórios mais antigos que o número de dias especificado
 * e mantém apenas um número limitado de arquivos
 */
export async function limparRelatoriosAntigos(): Promise<{
  removidos: number;
  porData: number;
  porQuantidade: number;
}> {
  try {
    console.log("Iniciando limpeza de relatórios antigos...");

    // Certifique-se de que o diretório existe
    if (!fs.existsSync(RELATORIOS_DIR)) {
      fs.mkdirSync(RELATORIOS_DIR, { recursive: true });
      console.log("Diretório de relatórios criado.");
      return { removidos: 0, porData: 0, porQuantidade: 0 };
    }

    const arquivos = await readdir(RELATORIOS_DIR);

    console.log("arquivos: ", arquivos);
    console.log("directory: ", RELATORIOS_DIR);

    if (arquivos.length === 0) {
      console.log("Nenhum relatório para limpar.");
      return { removidos: 0, porData: 0, porQuantidade: 0 };
    }

    // Data limite - tudo antes disso será removido
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - DIAS_PARA_MANTER);

    console.log(
      `Removendo relatórios anteriores a ${dataLimite.toLocaleString()}`
    );

    let removidosPorData = 0;

    // Para cada arquivo, verifica a data de criação
    for (const arquivo of arquivos) {
      if (!arquivo.endsWith(".pdf")) continue; // Só limpa PDFs

      const caminhoCompleto = path.join(RELATORIOS_DIR, arquivo);

      try {
        const stats = await stat(caminhoCompleto);

        // Se o arquivo é mais antigo que a data limite, remove
        if (stats.ctime < dataLimite) {
          await unlink(caminhoCompleto);
          console.log(`Removido por data: ${arquivo}`);
          removidosPorData++;
        }
      } catch (err) {
        console.error(`Erro ao processar arquivo ${arquivo}:`, err);
      }
    }

    console.log(
      `Limpeza por data concluída. ${removidosPorData} arquivo(s) removido(s).`
    );

    // Agora limpa por quantidade, se necessário
    let removidosPorQuantidade = 0;
    const arquivosRestantes = (await readdir(RELATORIOS_DIR)).filter((f) =>
      f.endsWith(".pdf")
    );

    if (arquivosRestantes.length > MAX_FILES) {
      removidosPorQuantidade = await limparPorQuantidade();
    }

    const totalRemovidos = removidosPorData + removidosPorQuantidade;
    console.log(
      `Limpeza total concluída. ${totalRemovidos} arquivo(s) removido(s) no total.`
    );

    return {
      removidos: totalRemovidos,
      porData: removidosPorData,
      porQuantidade: removidosPorQuantidade,
    };
  } catch (err) {
    console.error("Erro durante a limpeza de relatórios:", err);
    throw err;
  }
}

/**
 * Remove arquivos mais antigos se o número total exceder MAX_FILES
 * @returns Número de arquivos removidos
 */
async function limparPorQuantidade(): Promise<number> {
  try {
    const arquivos = (await readdir(RELATORIOS_DIR)).filter((f) =>
      f.endsWith(".pdf")
    );

    // Se não excede o limite, não faz nada
    if (arquivos.length <= MAX_FILES) return 0;

    console.log(
      `Número de PDFs (${arquivos.length}) excede o limite (${MAX_FILES}). Removendo os mais antigos...`
    );

    // Obtém informações de cada arquivo para ordenação
    const arquivosInfo = await Promise.all(
      arquivos.map(async (arquivo) => {
        const caminhoCompleto = path.join(RELATORIOS_DIR, arquivo);
        const stats = await stat(caminhoCompleto);
        return {
          nome: arquivo,
          caminho: caminhoCompleto,
          data: stats.ctime,
        };
      })
    );

    // Ordena do mais antigo para o mais recente
    arquivosInfo.sort((a, b) => a.data.getTime() - b.data.getTime());

    // Remove arquivos até atingir o limite
    const aRemover = arquivosInfo.length - MAX_FILES;

    for (let i = 0; i < aRemover; i++) {
      await unlink(arquivosInfo[i].caminho);
      console.log(`Removido por limite: ${arquivosInfo[i].nome}`);
    }

    console.log(
      `Limpeza por quantidade concluída. ${aRemover} arquivo(s) removido(s).`
    );
    return aRemover;
  } catch (err) {
    console.error("Erro durante a limpeza por quantidade:", err);
    throw err;
  }
}
