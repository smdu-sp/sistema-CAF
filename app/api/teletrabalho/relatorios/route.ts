import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoTeletrabalho, jsonErro } from "@/lib/teletrabalho/auth-api";
import { podeVerUnidade } from "@/lib/teletrabalho/permissoes";
import { formatarDataBr } from "@/lib/teletrabalho/datas";
import { gerarPdfRelatorioMensal, gerarPlanilhaRelatorioMensal } from "@/lib/teletrabalho/relatorios";

export async function GET(request: NextRequest) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  if (!sessao.acesso.podeRelatorios) return jsonErro("Sem permissão", 403);

  const sp = request.nextUrl.searchParams;
  const unidadeId = sp.get("unidadeId");
  const ano = Number(sp.get("ano"));
  const mes = Number(sp.get("mes"));
  const formato = sp.get("formato") === "xls" ? "xls" : "pdf";
  const tipo = sp.get("tipo") === "individual" ? "individual" : "consolidado";
  const servidorId = sp.get("servidorId");
  if (!unidadeId || !ano || !mes) return jsonErro("unidadeId, ano e mes são obrigatórios");
  if (!podeVerUnidade(sessao.acesso, unidadeId) && !sessao.acesso.acessoTotal) {
    return jsonErro("Sem permissão", 403);
  }

  const unidade = await prisma.ttUnidade.findUnique({ where: { id: unidadeId } });
  if (!unidade) return jsonErro("Unidade não encontrada", 404);

  const registros = await prisma.ttRegistroDiario.findMany({
    where: {
      unidadeId,
      excluidoEm: null,
      estado: "VALIDADO",
      data: {
        gte: new Date(Date.UTC(ano, mes - 1, 1)),
        lte: new Date(Date.UTC(ano, mes, 0)),
      },
      ...(tipo === "individual" && servidorId ? { servidorId } : {}),
    },
    include: {
      servidor: { select: { nome: true, rf: true } },
      atividades: true,
    },
    orderBy: [{ servidor: { nome: "asc" } }, { data: "asc" }],
  });

  const linhas = registros.map((r) => ({
    data: r.data,
    servidorNome: r.servidor.nome,
    servidorRf: r.servidor.rf,
    atividades: r.atividades
      .map((a) => `${a.descricaoSnapshot} (${a.quantidade} × ${a.pontuacaoUnitaria})`)
      .join("; "),
    pontuacao: r.pontuacaoTotal,
    processos: r.processosAnalisados,
    observacoes: [r.observacoes, r.dificuldades].filter(Boolean).join(" | ") || null,
  }));

  const competencia = `${String(mes).padStart(2, "0")}/${ano}`;
  const titulo =
    tipo === "individual"
      ? "Relatório mensal individual de teletrabalho"
      : "Relatório mensal consolidado de teletrabalho";

  const fechamento = await prisma.ttFechamentoMensal.findUnique({
    where: { unidadeId_ano_mes: { unidadeId, ano, mes } },
  });
  if (fechamento) {
    const ultima = await prisma.ttRelatorioEmitido.findFirst({
      where: { fechamentoId: fechamento.id, tipo },
      orderBy: { versao: "desc" },
    });
    await prisma.ttRelatorioEmitido.create({
      data: {
        fechamentoId: fechamento.id,
        tipo,
        versao: (ultima?.versao ?? 0) + 1,
        formato,
        emitidoPorId: sessao.usuario.id,
      },
    });
  }

  if (formato === "xls") {
    const buffer = gerarPlanilhaRelatorioMensal({
      titulo,
      unidade: `${unidade.sigla} — ${unidade.nome}`,
      competencia,
      linhas,
    });
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.ms-excel",
        "Content-Disposition": `attachment; filename="teletrabalho-${unidade.sigla}-${ano}-${mes}.xls"`,
      },
    });
  }

  const pdf = await gerarPdfRelatorioMensal({
    titulo,
    unidade: `${unidade.sigla} — ${unidade.nome}`,
    competencia,
    linhas,
  });
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="teletrabalho-${unidade.sigla}-${ano}-${mes}.pdf"`,
    },
  });
}
