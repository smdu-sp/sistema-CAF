import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

/** GET: reservas com status SOLICITADO (painel admin). Apenas ADM/DEV. */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const usuario = (session as any).usuario;
  if (usuario?.permissao !== "ADM" && usuario?.permissao !== "DEV") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const lista = await prisma.reserva.findMany({
    where: { status: "SOLICITADO" },
    orderBy: { criadoEm: "asc" },
    include: {
      sala: {
        select: {
          id: true,
          nome: true,
          andar: true,
          numero: true,
          lotacao: true,
        },
      },
      coordenadoria: { select: { nome: true } },
      participantes: {
        include: {
          usuario: {
            select: {
              nome: true,
              nomeSocial: true,
              login: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(
    lista.map((r) => ({
      id: r.id,
      criadoEm: r.criadoEm.toISOString(),
      inicio: r.inicio.toISOString(),
      fim: r.fim.toISOString(),
      titulo: r.titulo,
      usuarioNome: r.usuarioNome,
      usuarioLogin: r.usuarioLogin,
      emailContato: r.emailContato,
      telefoneRamal: r.telefoneRamal,
      numeroParticipantes: r.numeroParticipantes,
      layoutEscolhidoDescricao: r.layoutEscolhidoDescricao,
      sala: r.sala,
      coordenadoriaNome: r.coordenadoria?.nome ?? null,
      participantes: r.participantes.map((p) => ({
        nome: p.usuario.nomeSocial?.trim() || p.usuario.nome,
        login: p.usuario.login,
        email: p.usuario.email,
      })),
    }))
  );
}
