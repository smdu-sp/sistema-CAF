import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoTeletrabalho } from "@/lib/teletrabalho/auth-api";
import { dataUtc, formatarDataIso, hojeSaoPaulo, partesData } from "@/lib/teletrabalho/datas";
import { ehFeriado, listarFeriadosDoAno } from "@/lib/teletrabalho/dias-uteis";
import { ehDiaTeletrabalho } from "@/lib/teletrabalho/escala";

export async function GET() {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;

  const unidades = await prisma.ttUnidade.findMany({
    where: { ativo: true },
    orderBy: { nome: "asc" },
    select: { id: true, nome: true, sigla: true },
  });

  const hoje = hojeSaoPaulo();
  const { ano, mes } = partesData(hoje);
  let pendentes: string[] = [];

  if (sessao.acesso.servidorId) {
    const servidor = await prisma.ttServidor.findUnique({
      where: { id: sessao.acesso.servidorId },
      include: { escala: true, unidade: { include: { regimeEscala: true } } },
    });
    if (servidor) {
      const feriados = await listarFeriadosDoAno(ano);
      const registros = await prisma.ttRegistroDiario.findMany({
        where: {
          servidorId: servidor.id,
          excluidoEm: null,
          data: {
            gte: dataUtc(ano, mes, 1),
            lte: hoje,
          },
        },
        select: { data: true, estado: true },
      });
      const porData = new Map(registros.map((r) => [formatarDataIso(r.data), r.estado]));
      const ultimo = hoje.getUTCDate();
      for (let d = 1; d <= ultimo; d++) {
        const data = dataUtc(ano, mes, d);
        const iso = formatarDataIso(data);
        const tele = ehDiaTeletrabalho({
          data,
          grupo: servidor.escala?.grupo ?? 1,
          algoritmo: servidor.unidade.regimeEscala?.algoritmo ?? "atecc_grupos_2",
          ehFeriado: ehFeriado(data, feriados),
        });
        if (!tele) continue;
        const estado = porData.get(iso);
        if (!estado || estado === "RASCUNHO" || estado === "DEVOLVIDO") {
          pendentes.push(iso);
        }
      }
    }
  }

  return NextResponse.json({
    acesso: sessao.acesso,
    unidades,
    pendentes,
  });
}
