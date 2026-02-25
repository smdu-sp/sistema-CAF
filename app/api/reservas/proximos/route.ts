import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

/** GET: próximas reservas (fim >= agora), paginado. Apenas ADM/DEV. */
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
  const pagina = Math.max(1, parseInt(searchParams.get("pagina") ?? "1", 10));
  const limite = Math.min(50, Math.max(1, parseInt(searchParams.get("limite") ?? "10", 10)));
  const offset = (pagina - 1) * limite;

  const agora = new Date();

  const [total, reservas] = await Promise.all([
    prisma.reserva.count({
      where: { fim: { gte: agora } },
    }),
    prisma.reserva.findMany({
      where: { fim: { gte: agora } },
      include: { sala: true, coordenadoria: true },
      orderBy: { inicio: "asc" },
      skip: offset,
      take: limite,
    }),
  ]);

  return NextResponse.json({
    data: reservas.map((r) => ({
      id: r.id,
      salaNome: r.sala.nome,
      titulo: r.titulo,
      usuarioNome: r.usuarioNome,
      usuarioLogin: r.usuarioLogin,
      coordenadoriaNome: r.coordenadoria?.nome ?? null,
      inicio: r.inicio.toISOString(),
      fim: r.fim.toISOString(),
    })),
    total,
    pagina,
    limite,
  });
}
