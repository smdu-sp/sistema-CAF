import { NextRequest, NextResponse } from "next/server";
import { parseBaixaPatrimonioBody } from "@/lib/helpdesk/baixa-patrimonio";
import { normalizarStatusItem } from "@/lib/helpdesk/item-patrimonio";
import { buildUserIdMaps } from "@/lib/helpdesk/mappers";
import { getSessaoHelpdesk } from "@/lib/helpdesk/session";
import { registrarHistoricoStatusItem } from "@/lib/helpdesk/status-historico-patrimonio";
import { movimentarItemParaAtic } from "@/lib/helpdesk/transferencia-patrimonio";
import { prisma } from "@/lib/prisma";
import { getCapacidadesHelpdesk } from "@/lib/permissoes";

const STATUS_JA_BAIXADO = new Set(["Baixado", "Descartado", "Para Descarte"]);

export async function GET(request: NextRequest) {
  const sessao = await getSessaoHelpdesk();
  if ("error" in sessao) {
    return NextResponse.json({ error: sessao.error }, { status: sessao.status });
  }

  const capacidades = getCapacidadesHelpdesk(sessao.usuario.permissao);
  if (!capacidades.patrimonio) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const idItemParam = request.nextUrl.searchParams.get("idItem");
  const idItem = idItemParam ? Number.parseInt(idItemParam, 10) : undefined;

  const lista = await prisma.hdBaixaPatrimonio.findMany({
    where: idItem && Number.isFinite(idItem) ? { idItem } : undefined,
    include: {
      item: { select: { patrimonio: true, descsbpm: true } },
      usuarioBaixa: { select: { id: true, nome: true } },
    },
    orderBy: { dataBaixa: "desc" },
    take: 500,
  });

  const todosUsuarios = await prisma.usuario.findMany({
    where: { status: true },
    select: { id: true },
  });
  const { uuidToNum } = buildUserIdMaps(new Set(todosUsuarios.map((u) => u.id)));

  return NextResponse.json({
    baixas: lista.map((b) => ({
      id: b.id,
      idItem: b.idItem,
      patrimonio: b.item.patrimonio ?? "",
      descricao: b.item.descsbpm ?? "",
      dataBaixa: b.dataBaixa.toISOString(),
      idUsuarioBaixa: uuidToNum.get(b.idUsuarioBaixa) ?? 0,
      usuarioBaixa: b.usuarioBaixa.nome,
      documentoSbpm: b.documentoSbpm,
      observacao: b.observacao ?? "",
    })),
  });
}

export async function POST(request: NextRequest) {
  try {
    const sessao = await getSessaoHelpdesk();
    if ("error" in sessao) {
      return NextResponse.json({ error: sessao.error }, { status: sessao.status });
    }

    const { usuario } = sessao;
    const capacidades = getCapacidadesHelpdesk(usuario.permissao);
    if (!capacidades.patrimonio) {
      return NextResponse.json(
        { error: "Sem permissão para registrar baixas" },
        { status: 403 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Corpo da requisição inválido" },
        { status: 400 }
      );
    }

    const parsed = parseBaixaPatrimonioBody(body);
    if (parsed.error || !parsed.data) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const idItem = parsed.data.idItem as number;
    const item = await prisma.hdItemPatrimonio.findUnique({
      where: { idbem: idItem },
    });
    if (!item) {
      return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
    }

    const statusNorm = normalizarStatusItem(item.statusitem);
    if (STATUS_JA_BAIXADO.has(statusNorm)) {
      return NextResponse.json(
        { error: "Este item já consta como baixado ou em descarte" },
        { status: 409 }
      );
    }

    const baixaExistente = await prisma.hdBaixaPatrimonio.findFirst({
      where: { idItem },
    });
    if (baixaExistente) {
      return NextResponse.json(
        { error: "Já existe registro de baixa para este item" },
        { status: 409 }
      );
    }

    const motivoBaixaObs =
      (parsed.data!.observacao as string | null)?.trim() ||
      `Baixa formal — documento ${parsed.data!.documentoSbpm as string}`;

    const baixa = await prisma.$transaction(async (tx) => {
      await movimentarItemParaAtic(tx, {
        idItem,
        idUsuario: usuario.id,
        observacao: `Movimentação automática — baixa patrimonial. ${motivoBaixaObs}`,
      });

      const registro = await tx.hdBaixaPatrimonio.create({
        data: {
          idItem,
          dataBaixa: parsed.data!.dataBaixa as Date,
          idUsuarioBaixa: usuario.id,
          documentoSbpm: parsed.data!.documentoSbpm as string,
          observacao: (parsed.data!.observacao as string | null) ?? null,
        },
        include: {
          item: { select: { patrimonio: true, descsbpm: true } },
          usuarioBaixa: { select: { id: true, nome: true } },
        },
      });

      await tx.hdItemPatrimonio.update({
        where: { idbem: idItem },
        data: {
          statusitem: "Baixado",
          servidorId: null,
        },
      });

      await registrarHistoricoStatusItem(tx, {
        idItem,
        statusAnterior: item.statusitem,
        statusNovo: "Baixado",
        motivo: motivoBaixaObs,
        idUsuario: usuario.id,
      });

      return registro;
    });

    const todosUsuarios = await prisma.usuario.findMany({
      where: { status: true },
      select: { id: true },
    });
    const { uuidToNum } = buildUserIdMaps(new Set(todosUsuarios.map((u) => u.id)));

    return NextResponse.json(
      {
        baixa: {
          id: baixa.id,
          idItem: baixa.idItem,
          patrimonio: baixa.item.patrimonio ?? "",
          descricao: baixa.item.descsbpm ?? "",
          dataBaixa: baixa.dataBaixa.toISOString(),
          idUsuarioBaixa: uuidToNum.get(baixa.idUsuarioBaixa) ?? 0,
          usuarioBaixa: baixa.usuarioBaixa.nome,
          documentoSbpm: baixa.documentoSbpm,
          observacao: baixa.observacao ?? "",
        },
      },
      { status: 201 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[helpdesk/baixas POST]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
