"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { existeConflito } from "./services/reservas";

export type CriarReservaState = {
  erro?: string;
  sucesso?: boolean;
};

export async function criarReserva(
  _prev: CriarReservaState,
  formData: FormData
): Promise<CriarReservaState> {
  const session = await auth();
  if (!session?.user) {
    return { erro: "Faça login para reservar." };
  }
  const usuario = (session as any).usuario;
  if (!usuario?.login) {
    return { erro: "Dados do usuário não encontrados." };
  }
  const podeReservar = usuario.permissao === "USR" || usuario.permissao === "ADM" || usuario.permissao === "DEV";
  if (!podeReservar) {
    return { erro: "Sua permissão não permite reservar salas." };
  }

  const salaId = formData.get("salaId") as string;
  const dataStr = formData.get("data") as string;
  const horaInicio = formData.get("horaInicio") as string;
  const horaFim = formData.get("horaFim") as string;
  const tituloBase = (formData.get("titulo") as string)?.trim() ?? "";
  const solicitacoes = (formData.get("solicitacoes") as string)?.trim() ?? "";
  const titulo = solicitacoes ? `${tituloBase}\n${solicitacoes}`.trim() : tituloBase;
  const coordenadoriaIdForm = (formData.get("coordenadoriaId") as string)?.trim() || null;
  const participantesIds = (formData.getAll("participantesIds") as string[]) ?? [];
  const participantesIdsUnicos = [...new Set(participantesIds.map((id) => id.trim()).filter(Boolean))];

  if (!salaId || !dataStr || !horaInicio || !horaFim) {
    return { erro: "Preencha sala, data e horários." };
  }
  if (!titulo) {
    return { erro: "O título da reserva é obrigatório." };
  }
  if (!coordenadoriaIdForm) {
    return { erro: "A coordenadoria é obrigatória." };
  }

  const coordenadoriaExiste = await prisma.coordenadoria.findFirst({
    where: { id: coordenadoriaIdForm, ativo: true },
    select: { id: true },
  });
  if (!coordenadoriaExiste) {
    return { erro: "Coordenadoria inválida ou inativa." };
  }
  const coordenadoriaId = coordenadoriaIdForm;

  const [ano, mes, dia] = dataStr.split("-").map(Number);
  const [hi, mi] = horaInicio.split(":").map(Number);
  const [hf, mf] = horaFim.split(":").map(Number);
  const inicio = new Date(ano, mes - 1, dia, hi, mi, 0);
  const fim = new Date(ano, mes - 1, dia, hf, mf, 0);

  if (fim <= inicio) {
    return { erro: "O horário de término deve ser após o início." };
  }
  if (inicio < new Date()) {
    return { erro: "Não é possível reservar para um horário no passado." };
  }

  const conflito = await existeConflito(salaId, inicio, fim);
  if (conflito) {
    return { erro: "Já existe uma reserva nesta sala no horário escolhido." };
  }

  const nomeExibicao =
    usuario.nomeSocial || usuario.nome || usuario.login || "Usuário";

  const reserva = await prisma.reserva.create({
    data: {
      salaId,
      usuarioId: usuario.id ?? null,
      usuarioLogin: usuario.login,
      usuarioNome: nomeExibicao,
      coordenadoriaId,
      inicio,
      fim,
      titulo,
    },
  });

  if (participantesIdsUnicos.length > 0) {
    const usuariosExistentes = await prisma.usuario.findMany({
      where: { id: { in: participantesIdsUnicos }, status: true },
      select: { id: true },
    });
    const idsValidos = usuariosExistentes.map((u) => u.id);
    await prisma.reservaParticipante.createMany({
      data: idsValidos.map((usuarioId) => ({
        reservaId: reserva.id,
        usuarioId,
      })),
      skipDuplicates: true,
    });
  }

  revalidatePath("/reserva-salas");
  revalidatePath("/reserva-salas");
  revalidatePath("/reserva-salas/admin");
  redirect("/reserva-salas");
}

export async function cancelarReserva(
  reservaId: string,
  motivo?: string
): Promise<{ erro?: string }> {
  const session = await auth();
  if (!session?.user) {
    return { erro: "Não autorizado." };
  }
  const usuario = (session as any).usuario;
  if (!usuario?.login) {
    return { erro: "Dados do usuário não encontrados." };
  }

  const reserva = await prisma.reserva.findUnique({
    where: { id: reservaId },
  });
  if (!reserva) {
    return { erro: "Reserva não encontrada." };
  }
  const isAdmin = usuario?.permissao === "ADM" || usuario?.permissao === "DEV";
  if (!isAdmin && reserva.usuarioLogin !== usuario.login) {
    return { erro: "Você só pode cancelar suas próprias reservas." };
  }

  if (motivo?.trim()) {
    console.info("[cancelarReserva] Motivo:", motivo.trim(), "ReservaId:", reservaId);
  }

  await prisma.reserva.delete({ where: { id: reservaId } });
  revalidatePath("/reserva-salas");
  revalidatePath("/reserva-salas");
  revalidatePath("/reserva-salas/admin");
  return {};
}
