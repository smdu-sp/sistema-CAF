import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

/** GET: lista todas as salas ativas e reservas do dia (9h–19h) para painel admin. Apenas ADM/DEV. */
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const usuario = (session as any).usuario;
  const permissao = usuario?.permissao;
  if (permissao !== "ADM" && permissao !== "DEV") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const dataStr = searchParams.get("data"); // yyyy-mm-dd
  if (!dataStr) {
    return NextResponse.json(
      { error: "Parâmetro data (yyyy-mm-dd) é obrigatório" },
      { status: 400 }
    );
  }

  const [y, m, d] = dataStr.split("-").map(Number);
  if (!y || !m || !d) {
    return NextResponse.json({ error: "Data inválida" }, { status: 400 });
  }

  const inicioDia = new Date(y, m - 1, d, 9, 0, 0);
  const fimDia = new Date(y, m - 1, d, 19, 0, 0);

  const [salas, reservas] = await Promise.all([
    prisma.sala.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, andar: true, numero: true },
    }),
    prisma.reserva.findMany({
      where: {
        status: "APROVADO",
        inicio: { lt: fimDia },
        fim: { gt: inicioDia },
      },
      include: { sala: true, coordenadoria: true },
      orderBy: { inicio: "asc" },
    }),
  ]);

  return NextResponse.json({
    salas: salas.map((s) => ({
      id: s.id,
      nome: s.nome,
      andar: s.andar,
      numero: s.numero,
    })),
    reservas: reservas.map((r) => ({
      id: r.id,
      salaId: r.salaId,
      salaNome: r.sala.nome,
      titulo: r.titulo,
      usuarioNome: r.usuarioNome,
      usuarioLogin: r.usuarioLogin,
      coordenadoriaNome: r.coordenadoria?.nome ?? null,
      inicio: r.inicio.toISOString(),
      fim: r.fim.toISOString(),
      layoutEscolhidoDescricao: r.layoutEscolhidoDescricao ?? null,
      status: r.status,
    })),
  });
}
