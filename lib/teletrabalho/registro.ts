import { prisma } from "@/lib/prisma";
import { registrarAuditoria } from "./auditoria";
import { hojeSaoPaulo, parseDataIso, partesData } from "./datas";
import { atrasoObrigatorio, ehFeriado, listarFeriadosDoAno } from "./dias-uteis";
import { ehDiaTeletrabalho } from "./escala";
import { calcularPontuacao } from "./pontuacao";
import type { AcessoTeletrabalho } from "./permissoes";
import { podeValidarUnidade, podeVerRegistro } from "./permissoes";

type ItemEntrada = { atividadeId: string; quantidade: number };

async function carregarContextoServidor(servidorId: string, data: Date) {
  const servidor = await prisma.ttServidor.findUnique({
    where: { id: servidorId },
    include: {
      cargo: true,
      unidade: { include: { regimeEscala: true } },
      escala: true,
      termosAdesao: { where: { situacao: "vigente" }, orderBy: { dataAssinatura: "desc" } },
    },
  });
  if (!servidor || !servidor.ativo) {
    throw new Error("Servidor não encontrado ou inativo.");
  }

  const { ano } = partesData(data);
  const feriados = await listarFeriadosDoAno(ano);
  const feriado = ehFeriado(data, feriados);
  const grupo = (servidor.escala?.grupo === 2 ? 2 : 1) as 1 | 2;
  const algoritmo = servidor.unidade.regimeEscala?.algoritmo ?? "atecc_grupos_2";

  return { servidor, feriados, feriado, grupo, algoritmo };
}

async function assertPodeRegistrar(servidorId: string, data: Date) {
  const { servidor, feriados, feriado, grupo, algoritmo } = await carregarContextoServidor(servidorId, data);

  if (!ehDiaTeletrabalho({ data, grupo, algoritmo, ehFeriado: feriado })) {
    throw new Error("Só é permitido registrar em dia classificado como teletrabalho.");
  }

  const adesao = servidor.termosAdesao[0];
  if (!adesao || adesao.dataAssinatura.getTime() > data.getTime()) {
    throw new Error("Servidor sem Termo de Adesão vigente na data.");
  }

  const competenciaFechada = await prisma.ttFechamentoMensal.findUnique({
    where: {
      unidadeId_ano_mes: {
        unidadeId: servidor.unidadeId,
        ano: partesData(data).ano,
        mes: partesData(data).mes,
      },
    },
  });
  if (competenciaFechada?.situacao === "fechado") {
    throw new Error("Competência fechada. Os registros são imutáveis.");
  }

  return { servidor, feriados };
}

function assertAtraso(dataRegistro: Date, motivoAtraso: string | null | undefined, feriados: Date[]) {
  const hoje = hojeSaoPaulo();
  if (atrasoObrigatorio(dataRegistro, hoje, feriados) && !motivoAtraso?.trim()) {
    throw new Error("Prazo de preenchimento vencido. Informe o motivo do atraso.");
  }
}

export async function salvarRegistro(params: {
  servidorId: string;
  dataIso: string;
  itens: ItemEntrada[];
  processosAnalisados?: string | null;
  dificuldades?: string | null;
  observacoes?: string | null;
  motivoAtraso?: string | null;
  compensacao?: boolean;
  enviar: boolean;
  atorId: string;
}) {
  const data = parseDataIso(params.dataIso);
  const { servidor, feriados } = await assertPodeRegistrar(params.servidorId, data);

  if (params.enviar) {
    assertAtraso(data, params.motivoAtraso, feriados);
    if (!params.itens.length) {
      throw new Error("Informe ao menos uma atividade para enviar o registro.");
    }
  }

  const { total, itens } = params.itens.length
    ? await calcularPontuacao(servidor.cargoId, data, params.itens)
    : { total: 0, itens: [] };

  const existente = await prisma.ttRegistroDiario.findUnique({
    where: { servidorId_data: { servidorId: params.servidorId, data } },
  });

  if (existente?.excluidoEm) {
    throw new Error("Registro excluído não pode ser recriado.");
  }
  if (existente?.estado === "VALIDADO") {
    throw new Error("Registro validado só pode ser alterado após devolução da chefia.");
  }
  if (existente && existente.estado !== "RASCUNHO" && existente.estado !== "DEVOLVIDO") {
    throw new Error("Somente rascunho ou registro devolvido podem ser editados.");
  }

  const estado = params.enviar ? "ENVIADO" : "RASCUNHO";
  const agora = new Date();

  const registro = await prisma.$transaction(async (tx) => {
    const salvo = existente
      ? await tx.ttRegistroDiario.update({
          where: { id: existente.id },
          data: {
            estado,
            pontuacaoTotal: total,
            processosAnalisados: params.processosAnalisados ?? null,
            dificuldades: params.dificuldades ?? null,
            observacoes: params.observacoes ?? null,
            motivoAtraso: params.motivoAtraso ?? null,
            compensacao: params.compensacao ?? false,
            enviadoEm: params.enviar ? agora : existente.enviadoEm,
            justificativaDevolucao: params.enviar ? null : existente.justificativaDevolucao,
          },
        })
      : await tx.ttRegistroDiario.create({
          data: {
            servidorId: params.servidorId,
            unidadeId: servidor.unidadeId,
            data,
            estado,
            pontuacaoTotal: total,
            processosAnalisados: params.processosAnalisados ?? null,
            dificuldades: params.dificuldades ?? null,
            observacoes: params.observacoes ?? null,
            motivoAtraso: params.motivoAtraso ?? null,
            compensacao: params.compensacao ?? false,
            enviadoEm: params.enviar ? agora : null,
          },
        });

    await tx.ttAtividadeRegistro.deleteMany({ where: { registroId: salvo.id } });
    if (itens.length) {
      await tx.ttAtividadeRegistro.createMany({
        data: itens.map((i) => ({
          registroId: salvo.id,
          atividadeId: i.atividadeId,
          quantidade: i.quantidade,
          descricaoSnapshot: i.descricaoSnapshot,
          pontuacaoUnitaria: i.pontuacaoUnitaria,
        })),
      });
    }

    return salvo;
  });

  await registrarAuditoria({
    entidade: "TtRegistroDiario",
    entidadeId: registro.id,
    acao: params.enviar ? "enviar" : existente ? "alterar" : "criar",
    atorId: params.atorId,
    estadoAnterior: existente ?? undefined,
  });

  return registro;
}

export async function validarRegistros(params: {
  ids: string[];
  acesso: AcessoTeletrabalho;
  atorId: string;
}) {
  const registros = await prisma.ttRegistroDiario.findMany({
    where: { id: { in: params.ids }, excluidoEm: null },
  });
  if (!registros.length) throw new Error("Nenhum registro encontrado.");

  for (const r of registros) {
    if (!podeValidarUnidade(params.acesso, r.unidadeId)) {
      throw new Error("Sem permissão para validar registros desta unidade.");
    }
    if (r.estado !== "ENVIADO") {
      throw new Error("Somente registros enviados podem ser validados.");
    }
  }

  const agora = new Date();
  await prisma.ttRegistroDiario.updateMany({
    where: { id: { in: registros.map((r) => r.id) } },
    data: {
      estado: "VALIDADO",
      validadoEm: agora,
      validadoPorId: params.atorId,
    },
  });

  for (const r of registros) {
    await registrarAuditoria({
      entidade: "TtRegistroDiario",
      entidadeId: r.id,
      acao: "validar",
      atorId: params.atorId,
      estadoAnterior: { estado: r.estado },
    });
  }
}

export async function devolverRegistros(params: {
  ids: string[];
  justificativa: string;
  acesso: AcessoTeletrabalho;
  atorId: string;
}) {
  const justificativa = params.justificativa.trim();
  if (!justificativa) throw new Error("Justificativa é obrigatória na devolução.");

  const registros = await prisma.ttRegistroDiario.findMany({
    where: { id: { in: params.ids }, excluidoEm: null },
  });
  if (!registros.length) throw new Error("Nenhum registro encontrado.");

  for (const r of registros) {
    if (!podeValidarUnidade(params.acesso, r.unidadeId)) {
      throw new Error("Sem permissão para devolver registros desta unidade.");
    }
    if (r.estado !== "ENVIADO" && r.estado !== "VALIDADO") {
      throw new Error("Somente registros enviados ou validados podem ser devolvidos.");
    }
  }

  const agora = new Date();
  await prisma.ttRegistroDiario.updateMany({
    where: { id: { in: registros.map((r) => r.id) } },
    data: {
      estado: "DEVOLVIDO",
      devolvidoEm: agora,
      devolvidoPorId: params.atorId,
      justificativaDevolucao: justificativa,
      validadoEm: null,
      validadoPorId: null,
    },
  });

  for (const r of registros) {
    await registrarAuditoria({
      entidade: "TtRegistroDiario",
      entidadeId: r.id,
      acao: "devolver",
      atorId: params.atorId,
      estadoAnterior: { estado: r.estado },
    });
  }
}

export async function excluirRegistro(params: {
  id: string;
  motivo: string;
  acesso: AcessoTeletrabalho;
  atorId: string;
}) {
  const motivo = params.motivo.trim();
  if (!motivo) throw new Error("Motivo da exclusão é obrigatório.");

  const registro = await prisma.ttRegistroDiario.findUnique({ where: { id: params.id } });
  if (!registro || registro.excluidoEm) throw new Error("Registro não encontrado.");
  if (!podeVerRegistro(params.acesso, registro)) {
    throw new Error("Sem permissão para excluir este registro.");
  }
  if (registro.estado === "VALIDADO") {
    throw new Error("Registro validado não pode ser excluído. Solicite devolução à chefia.");
  }

  const { ano, mes } = partesData(registro.data);
  const fechamento = await prisma.ttFechamentoMensal.findUnique({
    where: { unidadeId_ano_mes: { unidadeId: registro.unidadeId, ano, mes } },
  });
  if (fechamento?.situacao === "fechado") {
    throw new Error("Competência fechada.");
  }

  await prisma.ttRegistroDiario.update({
    where: { id: registro.id },
    data: {
      excluidoEm: new Date(),
      excluidoPorId: params.atorId,
      motivoExclusao: motivo,
    },
  });

  await registrarAuditoria({
    entidade: "TtRegistroDiario",
    entidadeId: registro.id,
    acao: "excluir",
    atorId: params.atorId,
    estadoAnterior: { estado: registro.estado },
  });
}
