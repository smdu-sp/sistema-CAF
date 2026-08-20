import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoTeletrabalho, jsonErro } from "@/lib/teletrabalho/auth-api";
import { registrarAuditoria } from "@/lib/teletrabalho/auditoria";
import { parseDataIso } from "@/lib/teletrabalho/datas";
import { texto } from "@/lib/teletrabalho/http";

export async function GET(request: NextRequest) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  const ano = Number(request.nextUrl.searchParams.get("ano")) || new Date().getFullYear();
  const exercicio = await prisma.ttExercicio.findUnique({
    where: { ano },
    include: { feriados: { orderBy: { data: "asc" } } },
  });
  return NextResponse.json(exercicio?.feriados ?? []);
}

export async function POST(request: NextRequest) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  if (!sessao.acesso.podeCadastros) return jsonErro("Sem permissão", 403);
  const body = await request.json().catch(() => null);
  if (!body) return jsonErro("Corpo da requisição inválido");
  const data = parseDataIso(String(body.data ?? ""));
  const nome = texto(body.nome, 120);
  const tipo = body.tipo === "municipal" || body.tipo === "ponto_facultativo" ? body.tipo : "nacional";
  if (!nome) return jsonErro("Nome é obrigatório");
  const ano = data.getUTCFullYear();
  const exercicio = await prisma.ttExercicio.upsert({
    where: { ano },
    update: {},
    create: { ano, corrente: false },
  });
  const feriado = await prisma.ttFeriado.create({
    data: { exercicioId: exercicio.id, data, nome, tipo },
  });
  await registrarAuditoria({ entidade: "TtFeriado", entidadeId: feriado.id, acao: "criar", atorId: sessao.usuario.id });
  return NextResponse.json(feriado, { status: 201 });
}
