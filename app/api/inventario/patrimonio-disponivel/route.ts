import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exigeInventario } from "@/lib/inventario/api-helpers";

/**
 * Busca itens de patrimônio ainda NÃO vinculados a um equipamento, para o
 * vínculo na tela de detalhe. Filtra por patrimônio, descrição ou nº de série.
 */
export async function GET(request: NextRequest) {
  const gate = await exigeInventario();
  if ("error" in gate) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  const q = (request.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 2) {
    return NextResponse.json([]);
  }

  const itens = await prisma.hdItemPatrimonio.findMany({
    where: {
      excluido: false,
      equipamento: { is: null },
      OR: [
        { patrimonio: { contains: q } },
        { descsbpm: { contains: q } },
        { numserie: { contains: q } },
      ],
    },
    orderBy: { patrimonio: "asc" },
    take: 20,
    select: {
      idbem: true,
      patrimonio: true,
      descsbpm: true,
      tipo: true,
      numserie: true,
    },
  });

  return NextResponse.json(itens);
}
