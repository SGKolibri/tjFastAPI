import PDFDocument from "pdfkit";
import * as fs from "fs";

export interface PDFConfig {
  title: string;
  subtitle?: string;
  author?: string;
  company?: string;
  logo?: string;
}

export class ProfessionalPDFGenerator {
  private doc: PDFKit.PDFDocument;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 50;
  private currentY: number;

  constructor(config: PDFConfig) {
    this.doc = new PDFDocument({
      size: "A4",
      margin: this.margin,
      info: {
        Title: config.title,
        Author: config.author || "Sistema de Gestão",
        Subject: config.subtitle || "Relatório Gerencial",
        Keywords: "relatório, gestão, dados",
      },
    });

    this.pageWidth = this.doc.page.width;
    this.pageHeight = this.doc.page.height;
    this.currentY = this.margin;

    this.setupStyles();
    this.addHeader(config);
  }

  private setupStyles() {
    // Definir cores padrão
    this.doc.fillColor("#333333");
  }

  private addHeader(config: PDFConfig) {
    // Fundo do cabeçalho
    this.doc
      .rect(0, 0, this.pageWidth, 120)
      .fillAndStroke("#2c3e50", "#34495e");

    // Logo (se disponível)
    if (config.logo && fs.existsSync(config.logo)) {
      this.doc.image(config.logo, this.margin, 20, { width: 60 });
    }

    // Título principal
    this.doc
      .fillColor("#ffffff")
      .fontSize(24)
      .font("Helvetica-Bold")
      .text(config.title, this.margin + 80, 30, {
        width: this.pageWidth - this.margin * 2 - 80,
      });

    // Subtítulo
    if (config.subtitle) {
      this.doc
        .fontSize(14)
        .font("Helvetica")
        .text(config.subtitle, this.margin + 80, 60);
    }

    // Data e hora de geração
    const now = new Date();
    this.doc
      .fontSize(10)
      .text(`Gerado em: ${now.toLocaleString("pt-BR")}`, this.margin + 80, 85);

    // Empresa (se disponível)
    if (config.company) {
      this.doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(config.company, this.pageWidth - 200, 30, {
          width: 150,
          align: "right",
        });
    }

    this.currentY = 140;
  }

  addInfoTable(info: string[][]) {
    this.checkPageBreak(info.length * 25 + 20);

    const tableWidth = this.pageWidth - this.margin * 2;
    const labelWidth = tableWidth * 0.3;
    const valueWidth = tableWidth * 0.7;

    info.forEach((row, index) => {
      const rowY = this.currentY + index * 25;
      const bgColor = index % 2 === 0 ? "#ffffff" : "#f8f9fa";

      // Background da linha
      this.doc
        .rect(this.margin, rowY, tableWidth, 25)
        .fillAndStroke(bgColor, "#dee2e6");

      // Label
      this.doc
        .fillColor("#6c757d")
        .fontSize(10)
        .font("Helvetica-Bold")
        .text(row[0], this.margin + 10, rowY + 8, {
          width: labelWidth - 20,
        });

      // Value
      this.doc
        .fillColor("#495057")
        .fontSize(10)
        .font("Helvetica")
        .text(row[1], this.margin + labelWidth + 10, rowY + 8, {
          width: valueWidth - 20,
        });
    });

    this.currentY += info.length * 25 + 15;
  }

  addFuncionarioHeader(nome: string, status: string) {
    this.checkPageBreak(200);

    const statusColor = status === "Ativo" ? "#27ae60" : "#e74c3c";

    // Background do header
    this.doc
      .rect(this.margin, this.currentY, this.pageWidth - this.margin * 2, 40)
      .fillAndStroke("#f8f9fa", "#dee2e6");

    // Nome do funcionário
    this.doc
      .fillColor("#2c3e50")
      .fontSize(16)
      .font("Helvetica-Bold")
      .text(nome, this.margin + 15, this.currentY + 12);

    // Status badge
    const statusWidth = 60;
    // this.doc
    //   .rect(
    //     this.pageWidth - this.margin - statusWidth - 15,
    //     this.currentY + 8,
    //     statusWidth,
    //     24
    //   )
    //   .fillAndStroke(statusColor, statusColor);

    // this.doc
    //   .fillColor("#ffffff")
    //   .fontSize(10)
    //   .font("Helvetica-Bold")
    //   .text(
    //     status,
    //     this.pageWidth - this.margin - statusWidth - 15,
    //     this.currentY + 16,
    //     {
    //       width: statusWidth,
    //       align: "center",
    //     }
    //   );

    this.currentY += 50;
  }

  addSalaryHistory(salarios: any[]) {
    // Calcular espaço necessário para o histórico salarial
    const headerHeight = 45; // Título + cabeçalho da tabela
    const rowHeight = 20;
    const totalRows = salarios.length;
    const neededSpace = headerHeight + totalRows * rowHeight + 15;

    this.checkPageBreak(neededSpace);

    // Título da seção salarial
    this.doc
      .fillColor("#2c3e50")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Histórico Salarial", this.margin, this.currentY);

    this.currentY += 20;

    // Ordenar salários por ano e mês
    const salariosOrdenados = salarios.sort((a, b) => {
      if (a.ano !== b.ano) return a.ano - b.ano;
      return a.mes - b.mes;
    });

    // Cabeçalho da tabela de salários
    const headers = [
      "Período",
      "Salário Base",
      "H. Extras",
      "Benefícios",
      "Total",
    ];
    const colWidths = [0.2, 0.2, 0.15, 0.2, 0.25];

    this.addSalaryTableHeader(headers, colWidths);

    // Dados da tabela
    salariosOrdenados.forEach((salario, index) => {
      const periodo = `${String(salario.mes).padStart(2, "0")}/${salario.ano}`;
      const salarioBase = salario.salarioBase || 0;
      const horasExtras = salario.horasExtras || 0;
      const beneficiosTotal = salario.beneficios
        ? (salario.beneficios.cafe || 0) +
          (salario.beneficios.almoco || 0) +
          (salario.beneficios.passagem || 0)
        : 0;
      const total =
        salarioBase +
        horasExtras +
        beneficiosTotal +
        (salario.bonus || 0) -
        (salario.descontos || 0);

      const rowData = [
        periodo,
        `R$ ${salarioBase.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`,
        `R$ ${horasExtras.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`,
        `R$ ${beneficiosTotal.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`,
        `R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      ];

      this.addSalaryTableRow(rowData, colWidths, index % 2 === 0);
    });

    this.currentY += 15;
  }

  addFuncionarioSection(funcionario: any, numero: number) {
    // Calcular espaço total necessário para este funcionário
    const headerSpace = 50;
    const infoTableSpace = 5 * 25 + 15; // 5 linhas de informação básica
    const salarySpace = funcionario.salarios?.length
      ? 45 + funcionario.salarios.length * 20 + 15
      : 40; // Se não tem salário, só o aviso
    const dividerSpace = 20;

    const totalNeededSpace =
      headerSpace + infoTableSpace + salarySpace + dividerSpace;

    // Verificar se cabe na página atual
    this.checkPageBreak(totalNeededSpace);

    // Adicionar o conteúdo do funcionário
    this.addFuncionarioHeader(
      `${numero}. ${funcionario.name || "Nome não informado"}`,
      funcionario.status ? "Ativo" : "Inativo"
    );

    const infoBasica = [
      ["Cargo", funcionario.cargo?.nome || "Não atribuído"],
      ["CPF", funcionario.cpf || "Não informado"],
      ["Contato", funcionario.contato || "Não informado"],
      ["Banco", funcionario.banco || "Não informado"],
      ["Chave PIX", funcionario.chavePix || "Não informado"],
    ];

    this.addInfoTable(infoBasica);

    // console.log("Funcionário:", funcionario);

    if (funcionario.salarios && funcionario.salarios.length > 0) {
      this.addSalaryHistory(funcionario.salarios);
    } else {
      this.addNoSalaryInfo();
    }

    this.addDivider();
  }

  addSalaryTableHeader(headers: string[], colWidths: number[]) {
    const tableWidth = this.pageWidth - this.margin * 2;
    let currentX = this.margin;

    // Background do cabeçalho
    this.doc
      .rect(this.margin, this.currentY, tableWidth, 25)
      .fillAndStroke("#495057", "#343a40");

    this.doc.fillColor("#ffffff").fontSize(9).font("Helvetica-Bold");

    headers.forEach((header, index) => {
      const colWidth = tableWidth * colWidths[index];
      this.doc.text(header, currentX + 5, this.currentY + 8, {
        width: colWidth - 10,
        align: "center",
      });
      currentX += colWidth;
    });

    this.currentY += 25;
  }

  addSalaryTableRow(rowData: string[], colWidths: number[], isEven: boolean) {
    const tableWidth = this.pageWidth - this.margin * 2;
    const bgColor = isEven ? "#f8f9fa" : "#ffffff";
    let currentX = this.margin;

    // Background da linha
    this.doc
      .rect(this.margin, this.currentY, tableWidth, 20)
      .fillAndStroke(bgColor, "#dee2e6");

    this.doc.fillColor("#495057").fontSize(8).font("Helvetica");

    rowData.forEach((data, index) => {
      const colWidth = tableWidth * colWidths[index];
      const align = index === 0 ? "left" : "right"; // Período à esquerda, valores à direita

      this.doc.text(data, currentX + 5, this.currentY + 6, {
        width: colWidth - 10,
        align: align,
      });
      currentX += colWidth;
    });

    this.currentY += 20;
  }

  addNoSalaryInfo() {
    this.checkPageBreak(40);

    this.doc
      .rect(this.margin, this.currentY, this.pageWidth - this.margin * 2, 30)
      .fillAndStroke("#fff3cd", "#ffeaa7");

    this.doc
      .fillColor("#856404")
      .fontSize(10)
      .font("Helvetica-Oblique")
      .text(
        "Nenhum histórico salarial cadastrado",
        this.margin + 15,
        this.currentY + 10
      );

    this.currentY += 40;
  }

  addDivider() {
    this.checkPageBreak(20);

    this.doc
      .strokeColor("#dee2e6")
      .lineWidth(1)
      .moveTo(this.margin, this.currentY)
      .lineTo(this.pageWidth - this.margin, this.currentY)
      .stroke();

    this.currentY += 20;
  }

  addSection(title: string, content?: string) {
    this.checkPageBreak(60);

    // Linha separadora
    this.doc
      .strokeColor("#3498db")
      .lineWidth(2)
      .moveTo(this.margin, this.currentY)
      .lineTo(this.pageWidth - this.margin, this.currentY)
      .stroke();

    this.currentY += 10;

    // Título da seção
    this.doc
      .fillColor("#2c3e50")
      .fontSize(18)
      .font("Helvetica-Bold")
      .text(title, this.margin, this.currentY);

    this.currentY += 30;

    if (content) {
      this.doc
        .fillColor("#333333")
        .fontSize(12)
        .font("Helvetica")
        .text(content, this.margin, this.currentY, {
          width: this.pageWidth - this.margin * 2,
          align: "justify",
        });

      this.currentY +=
        this.doc.heightOfString(content, {
          width: this.pageWidth - this.margin * 2,
        }) + 20;
    }
  }

  addTable(headers: string[], rows: string[][]) {
    const tableWidth = this.pageWidth - this.margin * 2;
    const columnWidth = tableWidth / headers.length;
    const rowHeight = 25;

    this.checkPageBreak(rowHeight * (rows.length + 2));

    // Cabeçalho da tabela
    this.doc
      .rect(this.margin, this.currentY, tableWidth, rowHeight)
      .fillAndStroke("#3498db", "#2980b9");

    this.doc.fillColor("#ffffff").fontSize(10).font("Helvetica-Bold");

    headers.forEach((header, index) => {
      this.doc.text(
        header,
        this.margin + index * columnWidth + 5,
        this.currentY + 8,
        {
          width: columnWidth - 10,
          align: "left",
        }
      );
    });

    this.currentY += rowHeight;

    // Linhas da tabela
    rows.forEach((row, rowIndex) => {
      const fillColor = rowIndex % 2 === 0 ? "#ecf0f1" : "#ffffff";

      this.doc
        .rect(this.margin, this.currentY, tableWidth, rowHeight)
        .fillAndStroke(fillColor, "#bdc3c7");

      this.doc.fillColor("#333333").fontSize(9).font("Helvetica");

      row.forEach((cell, cellIndex) => {
        this.doc.text(
          cell || "",
          this.margin + cellIndex * columnWidth + 5,
          this.currentY + 8,
          {
            width: columnWidth - 10,
            align: "left",
          }
        );
      });

      this.currentY += rowHeight;
    });

    this.currentY += 20;
  }

  addSummaryCard(title: string, value: string, subtitle?: string) {
    const cardWidth = (this.pageWidth - this.margin * 2 - 20) / 3;
    const cardHeight = 80;

    this.checkPageBreak(cardHeight + 20);

    // Card background
    this.doc
      .rect(this.margin, this.currentY, cardWidth, cardHeight)
      .fillAndStroke("#ffffff", "#e74c3c");

    // Card content
    this.doc
      .fillColor("#e74c3c")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(title, this.margin + 10, this.currentY + 10, {
        width: cardWidth - 20,
      });

    this.doc
      .fillColor("#2c3e50")
      .fontSize(20)
      .text(value, this.margin + 10, this.currentY + 30);

    if (subtitle) {
      this.doc
        .fillColor("#7f8c8d")
        .fontSize(10)
        .font("Helvetica")
        .text(subtitle, this.margin + 10, this.currentY + 55);
    }
  }

  addChart(
    title: string,
    data: { label: string; value: number; color?: string }[]
  ) {
    this.checkPageBreak(200);

    this.doc
      .fillColor("#2c3e50")
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(title, this.margin, this.currentY);

    this.currentY += 30;

    const maxValue = Math.max(...data.map((d) => d.value));
    const chartWidth = this.pageWidth - this.margin * 2 - 100;
    const barHeight = 20;
    const barSpacing = 30;

    data.forEach((item, index) => {
      const barWidth = (item.value / maxValue) * chartWidth;
      const color = item.color || "#3498db";

      // Bar
      this.doc
        .rect(this.margin + 100, this.currentY, barWidth, barHeight)
        .fillAndStroke(color, color);

      // Label
      this.doc
        .fillColor("#333333")
        .fontSize(10)
        .font("Helvetica")
        .text(item.label, this.margin, this.currentY + 6, {
          width: 90,
          align: "right",
        });

      // Value
      this.doc.text(
        item.value.toString(),
        this.margin + 110 + barWidth,
        this.currentY + 6
      );

      this.currentY += barSpacing;
    });

    this.currentY += 20;
  }

  private checkPageBreak(neededSpace: number) {
    const availableSpace = this.pageHeight - this.margin - 50;

    if (this.currentY + neededSpace > availableSpace) {
      this.addPage();
    }
  }

  private addPage() {
    // Adicionar rodapé antes de criar nova página
    this.addFooter();
    // Criar nova página
    this.doc.addPage();
    // Resetar posição Y para o topo da nova página (depois do header)
    this.currentY = this.margin + 20;
  }

  private addFooter() {
    const footerY = this.pageHeight - 30;
  }

  pipe(stream: fs.WriteStream) {
    return this.doc.pipe(stream);
  }

  end() {
    this.addFooter();
    this.doc.end();
  }
}
