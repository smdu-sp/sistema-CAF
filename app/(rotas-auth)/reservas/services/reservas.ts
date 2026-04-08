import { prisma } from "@/lib/prisma";
import type { Layout } from "@prisma/client";

export type ReservaResumo = {
  id: string;
  salaId: string;
  salaNome: string;
  coordenadoriaNome: string | null;
  inicio: Date;
  fim: Date;
  titulo: string | null;
  criadoEm: Date;
  /** Tipo de layout móvel escolhido na reserva, se houver. */
  layoutEscolhidoDescricao: string | null;
};

export type SalaLayoutFotoOption = {
  id: string;
  descricao: string;
  imagemUrl: string;
};

export type SalaOption = {
  id: string;
  nome: string;
  andar: string | null;
  numero: string | null;
  lotacao: number | null;
  layout: Layout | null;
  layoutFotos: SalaLayoutFotoOption[];
  mobiliarios: { nome: string; quantidade: number }[];
  midias: { nome: string; quantidade: number }[];
};

export type CoordenadoriaOption = {
  id: string;
  nome: string;
};

export async function listarCoordenadoriasAtivas(): Promise<CoordenadoriaOption[]> {
  const lista = await prisma.coordenadoria.findMany({
    where: { ativo: true },
    orderBy: { nome: "asc" },
    select: { id: true, nome: true },
  });
  return lista;
}

export async function listarSalasAtivas(): Promise<SalaOption[]> {
  const salas = await prisma.sala.findMany({
    where: { ativo: true },
    orderBy: { nome: "asc" },
    select: {
      id: true,
      nome: true,
      andar: true,
      numero: true,
      lotacao: true,
      layout: true,
      layoutFotos: {
        select: { id: true, descricao: true, imagemUrl: true },
        orderBy: [{ ordem: "asc" }, { criadoEm: "asc" }],
      },
      mobiliarios: { select: { nome: true, quantidade: true } },
      midias: { select: { nome: true, quantidade: true } },
    },
  });
  return salas;
}

export async function listarMinhasReservas(
  usuarioLogin: string
): Promise<ReservaResumo[]> {
  const agora = new Date();
  const reservas = await prisma.reserva.findMany({
    where: {
      usuarioLogin,
      fim: { gte: agora },
    },
    include: { sala: true, coordenadoria: true },
    orderBy: { inicio: "asc" },
  });
  return reservas.map((r) => ({
    id: r.id,
    salaId: r.salaId,
    salaNome: r.sala.nome,
    coordenadoriaNome: r.coordenadoria?.nome ?? null,
    inicio: r.inicio,
    fim: r.fim,
    titulo: r.titulo,
    criadoEm: r.criadoEm,
    layoutEscolhidoDescricao: r.layoutEscolhidoDescricao ?? null,
  }));
}

/** Verifica se já existe reserva na sala no intervalo (sobreposição). */
export async function existeConflito(
  salaId: string,
  inicio: Date,
  fim: Date,
  excluirReservaId?: string
): Promise<boolean> {
  const count = await prisma.reserva.count({
    where: {
      salaId,
      id: excluirReservaId ? { not: excluirReservaId } : undefined,
      OR: [
        { inicio: { lte: inicio }, fim: { gt: inicio } },
        { inicio: { lt: fim }, fim: { gte: fim } },
        { inicio: { gte: inicio }, fim: { lte: fim } },
      ],
    },
  });
  return count > 0;
}
