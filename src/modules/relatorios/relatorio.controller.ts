import { FastifyReply, FastifyRequest } from "fastify";
import { RelatorioRequest } from "./relatorio.schema";
import { gerarRelatorio } from "./relatorio.services";

export async function gerarRelatorioHandler(
  request: FastifyRequest<{ Body: RelatorioRequest }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const resultado = await gerarRelatorio(body);

    const baseUrl =
      process.env.BASE_URL || request.protocol + "://" + request.hostname;

    // Use type assertion to add the property
    (resultado as any).viewUrl = resultado.url;

    if (body.formato === "pdf") {
      (resultado as any).viewUrl = `${resultado.url}?inline=true`;
    }

    return reply.status(200).send(resultado);
  } catch (e) {
    console.error(e);
    return reply
      .status(500)
      .send({ message: "Erro ao gerar relatório", error: e });
  }
}
