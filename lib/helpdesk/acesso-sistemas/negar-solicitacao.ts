import { prisma } from "@/lib/prisma";

import {

  buildUserIdMaps,

  chamadoInclude,

  collectUserIdsFromChamados,

  mapChamadoApi,

} from "@/lib/helpdesk/mappers";

import { enviarEmailNegacaoSetorLiberacao } from "./emails-setor-liberacao";



export async function negarSolicitacaoAcesso(params: {

  chamadoId: number;

  negadorId: string;

  negadorNome: string;

  motivo: string;

  baseUrl?: string;

}) {

  const { chamadoId, negadorId, negadorNome, motivo, baseUrl } = params;



  const solicitacao = await prisma.hdSolicitacaoAcesso.findUnique({

    where: { chamadoId },

    include: {

      sistema: { select: { nome: true } },

      permissao: { select: { nome: true } },

      unidade: { select: { nome: true } },

      coordenadoria: { select: { nome: true } },

      chamado: {

        select: {

          status: true,

          abertoEmNomeDe: { select: { nome: true, login: true } },

          solicitante: { select: { nome: true, login: true } },

        },

      },

    },

  });



  if (!solicitacao) throw new Error("Solicitação de acesso não encontrada");

  if (solicitacao.statusAutorizacao === "negado") {

    throw new Error("Solicitação já foi negada");

  }

  if (solicitacao.statusAutorizacao === "autorizado") {

    throw new Error("Solicitação já foi autorizada");

  }



  if (solicitacao.responsavelAutorizacaoId !== negadorId) {

    throw new Error("Somente o coordenador/diretor responsável pode negar esta solicitação");

  }



  await prisma.$transaction(async (tx) => {

    await tx.hdSolicitacaoAcesso.update({

      where: { id: solicitacao.id },

      data: {

        statusAutorizacao: "negado",

        negadoPorId: negadorId,

        motivoNegacao: motivo.trim(),

        dataAutorizacao: new Date(),

      },

    });



    await tx.hdChamado.update({

      where: { id: chamadoId },

      data: { status: "fechado", dataFechamento: new Date() },

    });



    await tx.hdChamadoEvento.create({

      data: {

        chamadoId,

        tipo: "fechamento",

        autorId: negadorId,

        texto: `${negadorNome} negou a solicitação de acesso: ${motivo.trim()}`,

      },

    });



    await tx.hdMensagem.create({

      data: {

        chamadoId,

        autorId: negadorId,

        texto: `Solicitação negada pelo responsável da unidade.\nMotivo: ${motivo.trim()}`,

        tipo: "publica",

      },

    });

  });



  const pontoFocal =

    solicitacao.chamado.abertoEmNomeDe ?? solicitacao.chamado.solicitante;

  const origin = baseUrl?.replace(/\/$/, "") ?? "";

  const linkChamado = origin

    ? `${origin}/helpdesk/chamados/acesso-sistemas?chamado=${chamadoId}`

    : `#${chamadoId}`;



  await enviarEmailNegacaoSetorLiberacao({

    chamadoId,

    nomeBeneficiario: solicitacao.nomeBeneficiario,

    rfBeneficiario: solicitacao.rfBeneficiario,

    sistema: solicitacao.sistema.nome,

    tipoPermissao: solicitacao.permissao.nome,

    unidade: solicitacao.unidade.nome,

    coordenadoria: solicitacao.coordenadoria?.nome ?? null,

    observacao: solicitacao.observacao,

    pontoFocalNome: pontoFocal.nome,

    pontoFocalRf: pontoFocal.login,

    negadoPorNome: negadorNome,

    motivoNegacao: motivo.trim(),

    linkChamado,

  });



  const completo = await prisma.hdChamado.findUnique({

    where: { id: chamadoId },

    include: chamadoInclude,

  });

  if (!completo) throw new Error("Chamado não encontrado");



  const ids = collectUserIdsFromChamados([completo]);

  const { uuidToNum } = buildUserIdMaps(ids);

  return mapChamadoApi(completo, uuidToNum, true);

}

