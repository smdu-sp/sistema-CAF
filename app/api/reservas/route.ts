import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validarPermissao } from "@/services/permissoes";

/** GET: lista reservas de uma sala em um dia (horário do prédio 9h–19h). */
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const salaId = searchParams.get("salaId");
  const dataStr = searchParams.get("data"); // yyyy-mm-dd

  if (!salaId || !dataStr) {
    return NextResponse.json(
      { error: "salaId e data são obrigatórios" },
      { status: 400 }
    );
  }

  const [y, m, d] = dataStr.split("-").map(Number);
  if (!y || !m || !d) {
    return NextResponse.json({ error: "Data inválida" }, { status: 400 });
  }


  let isAdmin = await validarPermissao("usuarios.importar");
  const inicioDia = new Date(y, m - 1, d, 9, 0, 0);
  const fimDia = new Date(y, m - 1, d, 19, 0, 0);

  const reservas = await prisma.reserva.findMany({
    where: {
      salaId,
      status: { in: ["SOLICITADO", "APROVADO"] },
      inicio: { lt: fimDia },
      fim: { gt: inicioDia },
    },
    select: {
      id: true,
      titulo: isAdmin,
      inicio: true,
      fim: true,
      usuarioNome: isAdmin,
    },
    orderBy: { inicio: "asc" },
  });

  if (isAdmin) {
    return NextResponse.json(
      reservas.map((r) => ({
        id: r.id,
        titulo: (r as any).titulo ?? "Sem título",
        inicio: r.inicio.toISOString(),
        fim: r.fim.toISOString(),
        usuarioNome: (r as any).usuarioNome,
      }))
    );
  }

  return NextResponse.json(
    reservas.map((r) => ({
      id: r.id,
      inicio: r.inicio.toISOString(),
      fim: r.fim.toISOString(),
    }))
  );
}
