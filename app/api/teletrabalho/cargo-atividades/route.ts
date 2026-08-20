import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoTeletrabalho, jsonErro } from "@/lib/teletrabalho/auth-api";
import { registrarAuditoria } from "@/lib/teletrabalho/auditoria";
import { parseDataIso, hojeSaoPaulo } from "@/lib/teletrabalho/datas";

export async function POST(request: NextRequest) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  if (!sessao.acesso.podeCadastros) return jsonErro("Sem permissão", 403);
  const body = await request.json().catch(() => null);
  if (!body) return jsonErro("Corpo da requisição inválido");
  const cargoId = typeof body.cargoId === "string" ? body.cargoId : "";
  const atividadeId = typeof body.atividadeId === "string" ? body.atividadeId : "";
  const pontuacao = Number(body.pontuacao);
  if (!cargoId || !atividadeId || !Number.isInteger(pontuacao) || pontuacao < 0) {
    return jsonErro("Cargo, atividade e pontuação inteira são obrigatórios");
  }

  const vigente = await prisma.ttCargoAtividade.findFirst({
    where: { cargoId, atividadeId, fimVigencia: null },
  });
  const hoje = hojeSaoPaulo();
  if (vigente) {
    if (vigente.pontuacao === pontuacao) {
      return jsonErro("Já existe associação vigente com esta pontuação", 409);
    }
    const ontem = new Date(hoje.getTime());
    ontem.setUTCDate(ontem.getUTCDate() - 1);
    await prisma.ttCargoAtividade.update({
      where: { id: vigente.id },
      data: { fimVigencia: ontem },
    });
  }

  const inicio = body.inicioVigencia ? parseDataIso(body.inicioVigencia) : hoje;
  const criado = await prisma.ttCargoAtividade.create({
    data: { cargoId, atividadeId, pontuacao, inicioVigencia: inicio },
    include: { cargo: true, atividade: true },
  });
  await registrarAuditoria({
    entidade: "TtCargoAtividade",
    entidadeId: criado.id,
    acao: "criar",
    atorId: sessao.usuario.id,
    estadoAnterior: vigente,
  });
  return NextResponse.json(criado, { status: 201 });
}
