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
  const titulo = (formData.get("titulo") as string)?.trim() ?? "";
  const telefoneRamal = (formData.get("telefoneRamal") as string)?.trim() || null;
  const numeroParticipantesStr = (formData.get("numeroParticipantes") as string)?.trim() ?? "";
  const coordenadoriaIdForm = (formData.get("coordenadoriaId") as string)?.trim() || null;
  const participantesIds = (formData.getAll("participantesIds") as string[]) ?? [];
  const participantesIdsUnicos = [...new Set(participantesIds.map((id) => id.trim()).filter(Boolean))];

  if (!salaId || !dataStr || !horaInicio || !horaFim) {
    return { erro: "Preencha sala, data e horários." };
  }
  if (!titulo) {
    return { erro: "O título da reserva é obrigatório." };
  }
  const usuarioNomeGravar = (
    (usuario.nomeSocial || usuario.nome || usuario.login || "") as string
  )
    .trim()
    .slice(0, 255);
  if (!usuarioNomeGravar) {
    return { erro: "Não foi possível identificar o nome do usuário logado." };
  }
  const emailContato = ((usuario.email as string | undefined) ?? "").trim();
  if (!emailContato || !emailContato.includes("@")) {
    return { erro: "Não foi possível identificar o e-mail do usuário logado." };
  }
  if (!telefoneRamal) {
    return { erro: "Informe o telefone ou ramal." };
  }
  const numeroParticipantes = Number.parseInt(numeroParticipantesStr, 10);
  if (!Number.isFinite(numeroParticipantes) || numeroParticipantes < 1) {
    return { erro: "Informe o número de participantes (mínimo 1)." };
  }
  if (!coordenadoriaIdForm) {
    return { erro: "A coordenadoria ou setor é obrigatório." };
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

  const reserva = await prisma.reserva.create({
    data: {
      salaId,
      usuarioId: usuario.id ?? null,
      usuarioLogin: usuario.login,
      usuarioNome: usuarioNomeGravar,
      coordenadoriaId,
      inicio,
      fim,
      titulo: titulo.length > 255 ? titulo.slice(0, 255) : titulo,
      telefoneRamal:
        telefoneRamal.length > 80 ? telefoneRamal.slice(0, 80) : telefoneRamal,
      emailContato:
        emailContato.length > 255 ? emailContato.slice(0, 255) : emailContato,
      numeroParticipantes,
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

  revalidatePath("/reservas/minhas");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/admin");
  redirect("/reservas/minhas");
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
  revalidatePath("/reservas/minhas");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/admin");
  return {};
}
