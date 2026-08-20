import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoTeletrabalho, jsonErro } from "@/lib/teletrabalho/auth-api";
import { idsUnidadesAcesso, podeVerRegistro } from "@/lib/teletrabalho/permissoes";
import { parseDataIso, partesData } from "@/lib/teletrabalho/datas";
import { salvarRegistro } from "@/lib/teletrabalho/registro";

export async function GET(request: NextRequest) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  const sp = request.nextUrl.searchParams;
  const unidadeId = sp.get("unidadeId");
  const servidorId = sp.get("servidorId");
  const estado = sp.get("estado");
  const ano = Number(sp.get("ano")) || undefined;
  const mes = Number(sp.get("mes")) || undefined;

  const filtroIds = idsUnidadesAcesso(sessao.acesso);
  const where: Record<string, unknown> = { excluidoEm: null };
  if (unidadeId) where.unidadeId = unidadeId;
  else if (filtroIds) where.unidadeId = { in: filtroIds };
  if (servidorId) where.servidorId = servidorId;
  if (!sessao.acesso.podeValidar && sessao.acesso.servidorId && !sessao.acesso.acessoTotal) {
    where.servidorId = sessao.acesso.servidorId;
  }
  if (estado) where.estado = estado;
  if (ano && mes) {
    where.data = {
      gte: new Date(Date.UTC(ano, mes - 1, 1)),
      lte: new Date(Date.UTC(ano, mes, 0)),
    };
  }

  const lista = await prisma.ttRegistroDiario.findMany({
    where,
    orderBy: { data: "desc" },
    include: {
      servidor: { select: { id: true, nome: true, rf: true } },
      unidade: { select: { sigla: true, nome: true } },
      atividades: true,
    },
  });
  return NextResponse.json(lista.filter((r) => podeVerRegistro(sessao.acesso, r)));
}

export async function POST(request: NextRequest) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  if (!sessao.acesso.podeRegistrar) return jsonErro("Sem permissão", 403);
  const body = await request.json().catch(() => null);
  if (!body) return jsonErro("Corpo da requisição inválido");

  const servidorId =
    typeof body.servidorId === "string" && body.servidorId
      ? body.servidorId
      : sessao.acesso.servidorId;
  if (!servidorId) return jsonErro("Servidor não vinculado ao usuário");
  if (!sessao.acesso.acessoTotal && sessao.acesso.servidorId && servidorId !== sessao.acesso.servidorId) {
    return jsonErro("Só é permitido registrar as próprias atividades", 403);
  }

  try {
    const registro = await salvarRegistro({
      servidorId,
      dataIso: String(body.data),
      itens: Array.isArray(body.itens) ? body.itens : [],
      processosAnalisados: body.processosAnalisados ?? null,
      dificuldades: body.dificuldades ?? null,
      observacoes: body.observacoes ?? null,
      motivoAtraso: body.motivoAtraso ?? null,
      compensacao: Boolean(body.compensacao),
      enviar: Boolean(body.enviar),
      atorId: sessao.usuario.id,
    });
    const completo = await prisma.ttRegistroDiario.findUnique({
      where: { id: registro.id },
      include: { atividades: true, servidor: { select: { nome: true, rf: true } } },
    });
    return NextResponse.json(completo, { status: 201 });
  } catch (e) {
    return jsonErro(e instanceof Error ? e.message : "Erro ao salvar registro");
  }
}

export { parseDataIso, partesData };
