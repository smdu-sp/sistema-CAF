import { prisma } from "@/lib/prisma";
import { textoAutorizacaoAcessoAutomatica } from "@/lib/helpdesk/eventos";
import { limiteDataAutorizacaoTacita } from "./constants";

export async function autorizarSolicitacaoAcesso(
  chamadoId: number,
  opts?: { automatico?: boolean }
): Promise<boolean> {
  const solicitacao = await prisma.hdSolicitacaoAcesso.findUnique({
    where: { chamadoId },
    include: { chamado: { select: { solicitanteId: true, status: true } } },
  });

  if (!solicitacao || solicitacao.statusAutorizacao !== "aguardando") {
    return false;
  }
  if (solicitacao.chamado.status !== "aguardando_autorizacao") {
    return false;
  }

  const automatico = opts?.automatico ?? false;
  const textoEvento = automatico
    ? textoAutorizacaoAcessoAutomatica()
    : "Solicitação autorizada pelo responsável da unidade";

  await prisma.$transaction(async (tx) => {
    await tx.hdSolicitacaoAcesso.update({
      where: { id: solicitacao.id },
      data: {
        statusAutorizacao: "autorizado",
        dataAutorizacao: new Date(),
      },
    });

    await tx.hdChamado.update({
      where: { id: chamadoId },
      data: { status: "aberto" },
    });

    await tx.hdChamadoEvento.create({
      data: {
        chamadoId,
        tipo: "statusAlterado",
        autorId: solicitacao.chamado.solicitanteId,
        texto: textoEvento,
      },
    });

    if (automatico) {
      await tx.hdMensagem.create({
        data: {
          chamadoId,
          autorId: solicitacao.chamado.solicitanteId,
          texto:
            "Solicitação considerada autorizada automaticamente após 7 dias sem negativa do coordenador/diretor. O chamado segue para atendimento pela equipe de liberação de acesso.",
          tipo: "publica",
        },
      });
    }
  });

  return true;
}

/** Autoriza solicitações aguardando há mais de 7 dias sem negativa. */
export async function processarAutorizacoesPendentesExpiradas(): Promise<number> {
  const limite = limiteDataAutorizacaoTacita();

  const pendentes = await prisma.hdSolicitacaoAcesso.findMany({
    where: {
      statusAutorizacao: "aguardando",
      criadoEm: { lte: limite },
      chamado: { status: "aguardando_autorizacao" },
    },
    select: { chamadoId: true },
    orderBy: { criadoEm: "asc" },
  });

  let processados = 0;
  for (const item of pendentes) {
    const ok = await autorizarSolicitacaoAcesso(item.chamadoId, { automatico: true });
    if (ok) processados += 1;
  }

  return processados;
}
