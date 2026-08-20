import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoTeletrabalho, jsonErro } from "@/lib/teletrabalho/auth-api";
import { idsUnidadesAcesso, podeVerUnidade } from "@/lib/teletrabalho/permissoes";
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

export async function GET(request: NextRequest) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;

  const unidadeId = request.nextUrl.searchParams.get("unidadeId");
  const filtroIds = idsUnidadesAcesso(sessao.acesso);
  const lista = await prisma.ttServidor.findMany({
    where: {
      ...(unidadeId ? { unidadeId } : {}),
      ...(filtroIds ? { unidadeId: { in: filtroIds } } : {}),
    },
    orderBy: { nome: "asc" },
    select,
  });
  return NextResponse.json(lista);
}

export async function POST(request: NextRequest) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  if (!sessao.acesso.podeCadastros) return jsonErro("Sem permissão", 403);

  const body = await request.json().catch(() => null);
  if (!body) return jsonErro("Corpo da requisição inválido");

  const rf = texto(body.rf, 7).toLowerCase();
  const nome = texto(body.nome);
  const email = texto(body.email, 180);
  const unidadeId = texto(body.unidadeId, 40);
  const cargoId = texto(body.cargoId, 40);
  if (!rf || rf.length !== 7 || !nome || !email || !unidadeId || !cargoId) {
    return jsonErro("RF (7 caracteres), nome, e-mail, unidade e cargo são obrigatórios");
  }
  if (!podeVerUnidade(sessao.acesso, unidadeId) && !sessao.acesso.podeCadastros) {
    return jsonErro("Sem permissão para esta unidade", 403);
  }

  const dup = await prisma.ttServidor.findUnique({ where: { rf } });
  if (dup) return jsonErro("Já existe servidor com este RF", 409);

  const usuario = await prisma.usuario.findUnique({ where: { login: rf }, select: { id: true } });

  const servidor = await prisma.ttServidor.create({
    data: {
      rf,
      nome,
      email,
      telefoneSetor: texto(body.telefoneSetor, 30) || null,
      unidadeId,
      cargoId,
      usuarioId: usuario?.id ?? null,
    },
    select,
  });

  const grupo = Number(body.grupo) === 2 ? 2 : 1;
  await prisma.ttEscalaServidor.create({
    data: {
      servidorId: servidor.id,
      grupo,
      janelaInicio: texto(body.janelaInicio, 5) || "09:00",
      janelaFim: texto(body.janelaFim, 5) || "18:00",
      horarioAlmocoInicio: texto(body.horarioAlmocoInicio, 5) || "12:00",
      horarioAlmocoFim: texto(body.horarioAlmocoFim, 5) || "13:00",
    },
  });

  await registrarAuditoria({
    entidade: "TtServidor",
    entidadeId: servidor.id,
    acao: "criar",
    atorId: sessao.usuario.id,
  });
  return NextResponse.json(servidor, { status: 201 });
}
