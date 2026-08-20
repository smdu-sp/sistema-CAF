import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoTeletrabalho, jsonErro } from "@/lib/teletrabalho/auth-api";
import { podeVerUnidade } from "@/lib/teletrabalho/permissoes";
import { dataUtc, formatarDataIso, partesData } from "@/lib/teletrabalho/datas";
import { ehFeriado, listarFeriadosDoAno } from "@/lib/teletrabalho/dias-uteis";
import { resolverStatusDia } from "@/lib/teletrabalho/escala";

export async function GET(request: NextRequest) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  const sp = request.nextUrl.searchParams;
  const unidadeId = sp.get("unidadeId");
  const ano = Number(sp.get("ano")) || new Date().getFullYear();
  const mes = Number(sp.get("mes")) || new Date().getMonth() + 1;
  if (!unidadeId) return jsonErro("unidadeId é obrigatório");
  if (!podeVerUnidade(sessao.acesso, unidadeId) && !sessao.acesso.acessoTotal) {
    return jsonErro("Sem permissão", 403);
  }

  const [regime, servidores, feriados] = await Promise.all([
    prisma.ttRegimeEscala.findUnique({ where: { unidadeId } }),
    prisma.ttServidor.findMany({
      where: { unidadeId, ativo: true },
      include: { escala: true },
      orderBy: { nome: "asc" },
    }),
    listarFeriadosDoAno(ano),
  ]);

  const algoritmo = regime?.algoritmo ?? "atecc_grupos_2";
  const ultimoDia = new Date(Date.UTC(ano, mes, 0)).getUTCDate();
  const dias = [];
  for (let dia = 1; dia <= ultimoDia; dia++) {
    const data = dataUtc(ano, mes, dia);
    const feriado = ehFeriado(data, feriados);
    dias.push({
      data: formatarDataIso(data),
      weekday: partesData(data).weekday,
      feriado,
      servidores: servidores.map((s) => ({
        servidorId: s.id,
        nome: s.nome,
        grupo: s.escala?.grupo ?? 1,
        status: resolverStatusDia({
          data,
          grupo: s.escala?.grupo ?? 1,
          algoritmo,
          ehFeriado: feriado,
        }),
      })),
    });
  }

  return NextResponse.json({
    ano,
    mes,
    algoritmo,
    feriados: feriados.map(formatarDataIso),
    servidores: servidores.map((s) => ({
      id: s.id,
      nome: s.nome,
      rf: s.rf,
      grupo: s.escala?.grupo ?? 1,
    })),
    dias,
  });
}
