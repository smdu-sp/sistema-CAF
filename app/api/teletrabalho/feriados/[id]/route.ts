import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoTeletrabalho, jsonErro } from "@/lib/teletrabalho/auth-api";
import { registrarAuditoria } from "@/lib/teletrabalho/auditoria";
import { texto } from "@/lib/teletrabalho/http";

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
  const anterior = await prisma.ttFeriado.findUnique({ where: { id } });
  if (!anterior) return jsonErro("Feriado não encontrado", 404);
  const data: { nome?: string; tipo?: "nacional" | "municipal" | "ponto_facultativo"; ativo?: boolean } = {};
  if (typeof body.nome === "string") data.nome = texto(body.nome, 120);
  if (body.tipo === "nacional" || body.tipo === "municipal" || body.tipo === "ponto_facultativo") {
    data.tipo = body.tipo;
  }
  if (typeof body.ativo === "boolean") data.ativo = body.ativo;
  const feriado = await prisma.ttFeriado.update({ where: { id }, data });
  await registrarAuditoria({
    entidade: "TtFeriado",
    entidadeId: id,
    acao: "alterar",
    atorId: sessao.usuario.id,
    estadoAnterior: anterior,
  });
  return NextResponse.json(feriado);
}
