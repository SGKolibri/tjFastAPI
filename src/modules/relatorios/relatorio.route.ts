import { FastifyInstance, FastifyRequest } from "fastify";
import { gerarRelatorioHandler } from "./relatorio.controller";
import { $ref } from "./relatorio.schema";
import path from "path";
import fs from "fs";
import { limparRelatoriosAntigos } from "./relatorio.services";

export default async function relatorioRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("relatorioRequestSchema"),
        response: {
          200: $ref("relatorioResponseSchema"),
        },
      },
    },
    gerarRelatorioHandler
  );

  server.get(
    "/view/:filename",
    {
      preHandler: [server.authenticate],
    },
    async (
      request: FastifyRequest<{ Params: { filename: string } }>,
      reply
    ) => {
      const { filename } = request.params;
      const filePath = path.join(
        __dirname,
        "../../../public/relatorios",
        filename
      );

      try {
        // Verificar se o arquivo existe
        await fs.promises.access(filePath, fs.constants.F_OK);

        // Configurar headers para exibição no navegador
        reply.header(
          "Content-Type",
          filename.endsWith(".pdf")
            ? "application/pdf"
            : "application/octet-stream"
        );
        reply.header(
          "Content-Disposition",
          'inline; filename="' + filename + '"'
        );

        // Enviar o arquivo para o cliente
        return (reply as any).sendFile(filename);
      } catch (error) {
        return reply.status(404).send({ error: "Relatório não encontrado" });
      }
    }
  );

  server.post(
    "/cleanup",
    {
      preHandler: [server.authenticate],
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
              removidos: { type: "number" },
              porData: { type: "number" },
              porQuantidade: { type: "number" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const resultado = await limparRelatoriosAntigos();
        return reply.status(200).send({
          success: true,
          message: `Limpeza concluída. ${resultado.removidos} arquivo(s) removido(s) no total.`,
          ...resultado,
        });
      } catch (error) {
        console.error("Erro ao executar limpeza manual:", error);
        return reply.status(500).send({
          success: false,
          message: "Erro ao executar limpeza",
          error: String(error),
        });
      }
    }
  );
}
