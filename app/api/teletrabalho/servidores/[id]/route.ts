import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoTeletrabalho, jsonErro } from "@/lib/teletrabalho/auth-api";
import { registrarAuditoria } from "@/lib/teletrabalho/auditoria";
import { texto } from "@/lib/teletrabalho/http";

const select = {
  id: true,
  rf: true,
  nome: true,
  email: true,
  telefoneSetor: true,
  unidadeId: true,
  cargoId: true,
  usuarioId: true,
  ativo: true,
  unidade: { select: { id: true, nome: true, sigla: true } },
  cargo: { select: { id: true, nome: true } },
  escala: { select: { grupo: true, janelaInicio: true, janelaFim: true, horarioAlmocoInicio: true, horarioAlmocoFim: true } },
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  if (!sessao.acesso.podeCadastros) return jsonErro("Sem permissão", 403);

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return jsonErro("Corpo da requisição inválido");

  const anterior = await prisma.ttServidor.findUnique({ where: { id } });
  if (!anterior) return jsonErro("Servidor não encontrado", 404);

  const data: Record<string, unknown> = {};
  if (typeof body.nome === "string") data.nome = texto(body.nome);
  if (typeof body.email === "string") data.email = texto(body.email, 180);
  if (body.telefoneSetor !== undefined) data.telefoneSetor = texto(body.telefoneSetor, 30) || null;
  if (typeof body.unidadeId === "string") data.unidadeId = body.unidadeId;
  if (typeof body.cargoId === "string") data.cargoId = body.cargoId;
  if (typeof body.ativo === "boolean") data.ativo = body.ativo;

  const servidor = await prisma.ttServidor.update({ where: { id }, data, select });

  if (body.grupo !== undefined || body.janelaInicio !== undefined) {
    const grupo = Number(body.grupo) === 2 ? 2 : 1;
    await prisma.ttEscalaServidor.upsert({
      where: { servidorId: id },
      update: {
        grupo,
        janelaInicio: texto(body.janelaInicio, 5) || undefined,
        janelaFim: texto(body.janelaFim, 5) || undefined,
        horarioAlmocoInicio: texto(body.horarioAlmocoInicio, 5) || undefined,
        horarioAlmocoFim: texto(body.horarioAlmocoFim, 5) || undefined,
      },
      create: {
        servidorId: id,
        grupo,
        janelaInicio: texto(body.janelaInicio, 5) || "09:00",
        janelaFim: texto(body.janelaFim, 5) || "18:00",
        horarioAlmocoInicio: texto(body.horarioAlmocoInicio, 5) || "12:00",
        horarioAlmocoFim: texto(body.horarioAlmocoFim, 5) || "13:00",
      },
    });
  }

  await registrarAuditoria({
    entidade: "TtServidor",
    entidadeId: id,
    acao: "alterar",
    atorId: sessao.usuario.id,
    estadoAnterior: anterior,
  });
  return NextResponse.json(servidor);
}
