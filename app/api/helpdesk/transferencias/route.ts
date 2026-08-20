import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildUserIdMaps } from "@/lib/helpdesk/mappers";
import { getSessaoHelpdesk } from "@/lib/helpdesk/session";
import { getCapacidadesHelpdesk } from "@/lib/permissoes";

export async function POST(request: NextRequest) {
  try {
    const sessao = await getSessaoHelpdesk();
    if ("error" in sessao) {
      return NextResponse.json({ error: sessao.error }, { status: sessao.status });
    }

    const { usuario } = sessao;
    const capacidades = getCapacidadesHelpdesk(usuario.permissao);

    if (!capacidades.patrimonio) {
      return NextResponse.json({ error: "Sem permissão para registrar transferências" }, { status: 403 });
    }

    const body = await request.json();
    const unidadeId = typeof body.unidadeId === "string" ? body.unidadeId.trim() : "";
    const observacao = typeof body.observacao === "string" ? body.observacao.trim() : "";
    const itens: Array<{ idItem: number; servidorAnterior: string; servidorAtual: string }> =
      Array.isArray(body.itens) ? body.itens : [];

    if (!unidadeId) {
      return NextResponse.json({ error: "Unidade é obrigatória" }, { status: 400 });
    }
    if (itens.length === 0) {
      return NextResponse.json({ error: "Selecione ao menos um item" }, { status: 400 });
    }

    const unidade = await prisma.hdUnidade.findFirst({ where: { id: unidadeId, ativo: true } });
    if (!unidade) {
      return NextResponse.json({ error: "Unidade não encontrada" }, { status: 400 });
    }

    const cabId = await prisma.$transaction(async (tx) => {
      const cab = await tx.hdTransferenciaCabecalho.create({
        data: {
          cimbpm: "TRF-PENDENTE",
          observacao: observacao || null,
          idUsuarioRegistro: usuario.id,
          idUnidadeDestino: unidadeId,
        },
      });

      const ano = new Date().getFullYear();
      await tx.hdTransferenciaCabecalho.update({
        where: { id: cab.id },
        data: { cimbpm: `TRF-${ano}-${String(cab.id).padStart(4, "0")}` },
      });

      for (const it of itens) {
        await tx.hdTransferenciaItem.create({
          data: {
            cabecalhoId: cab.id,
            idItem: Number(it.idItem),
            servidorAnterior: it.servidorAnterior || null,
            servidorAtual: it.servidorAtual || null,
          },
        });
      }

      return cab.id;
    });

    const completo = await prisma.hdTransferenciaCabecalho.findUnique({
      where: { id: cabId },
      include: {
        itens: {
          include: {
            item: { select: { patrimonio: true, descsbpm: true } },
          },
        },
        unidadeDestino: true,
      },
    });

    if (!completo) {
      return NextResponse.json({ error: "Erro ao criar transferência" }, { status: 500 });
    }

    const todosUsuarios = await prisma.usuario.findMany({
      where: { status: true },
      select: { id: true },
    });
    const { uuidToNum } = buildUserIdMaps(new Set(todosUsuarios.map((u) => u.id)));

    return NextResponse.json(
      {
        transferencia: {
          id: completo.id,
          cimbpm: completo.cimbpm,
          observacao: completo.observacao ?? "",
          dataTransferencia: completo.dataTransferencia.toISOString(),
          idUsuarioRegistro: uuidToNum.get(completo.idUsuarioRegistro) ?? 0,
          idUnidadeDestino: completo.idUnidadeDestino,
          unidadeDestino: completo.unidadeDestino.sigla ?? completo.unidadeDestino.nome,
          itens: completo.itens.map((i) => ({
            id: i.id,
            idItem: i.idItem,
            patrimonio: i.item.patrimonio ?? "",
            descricao: i.item.descsbpm ?? "",
            servidorAnterior: i.servidorAnterior ?? "—",
            servidorAtual: i.servidorAtual ?? "—",
          })),
        },
      },
      { status: 201 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[helpdesk/transferencias POST]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
