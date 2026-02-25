import { prisma } from "@/lib/prisma";

export type AgendamentoResumo = {
  id: string;
  salaId: string;
  salaNome: string;
  usuarioId: string;
  usuarioNome: string;
  coordenadoriaNome: string | null;
  inicio: Date;
  fim: Date;
};

export async function listarAgendamentosPorDia(data: Date): Promise<AgendamentoResumo[]> {
  const inicioDia = new Date(
    data.getFullYear(),
    data.getMonth(),
    data.getDate(),
    0,
    0,
    0,
  );
  const fimDia = new Date(
    data.getFullYear(),
    data.getMonth(),
    data.getDate(),
    23,
    59,
    59,
  );

  const reservas = await prisma.reserva.findMany({
    where: {
      inicio: { lte: fimDia },
      fim: { gte: inicioDia },
    },
    include: { sala: true, coordenadoria: true },
    orderBy: { inicio: "asc" },
  });

  return reservas.map((r) => ({
    id: r.id,
    salaId: r.salaId,
    salaNome: r.sala.nome,
    usuarioId: r.usuarioLogin,
    usuarioNome: r.usuarioNome ?? r.usuarioLogin,
    coordenadoriaNome: r.coordenadoria?.nome ?? null,
    inicio: r.inicio,
    fim: r.fim,
  }));
}
