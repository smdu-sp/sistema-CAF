import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { usuarioPodeAcessarChamado } from "@/lib/helpdesk/acesso";
import {
  chamadoInclude,
  collectUserIdsFromChamados,
  mapChamadoApi,
} from "@/lib/helpdesk/mappers";
import { getHelpdeskUserIdMaps } from "@/lib/helpdesk/user-id-maps";
import {
  textoAtribuicaoAdicionada,
  textoAtribuicaoRemovida,
  textoObservadorAdicionado,
  textoObservadorRemovido,
  textoRequerenteAlterado,
  textoStatusAberto,
  textoStatusAtendimento,
} from "@/lib/helpdesk/eventos";
import { getSessaoHelpdesk, isStaffPermissao } from "@/lib/helpdesk/session";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessao = await getSessaoHelpdesk();
    if ("error" in sessao) {
      return NextResponse.json({ error: sessao.error }, { status: sessao.status });
    }

    if (!sessao.isStaff) {
      return NextResponse.json(
        { error: "Apenas técnicos podem alterar os atores do chamado" },
        { status: 403 }
      );
    }

    const { usuario } = sessao;
    const { id: idParam } = await params;
    const chamadoId = parseInt(idParam, 10);
    if (Number.isNaN(chamadoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const pode = await usuarioPodeAcessarChamado(chamadoId, usuario.id, true);
    if (!pode) {
      return NextResponse.json({ error: "Chamado não encontrado" }, { status: 404 });
    }

    const atual = await prisma.hdChamado.findUnique({
      where: { id: chamadoId },
      include: { usuarios: true, solicitante: { select: { id: true, nome: true } } },
    });
    if (!atual) {
      return NextResponse.json({ error: "Chamado não encontrado" }, { status: 404 });
    }

    if (atual.status === "fechado") {
      return NextResponse.json(
        { error: "Não é possível alterar atores de um chamado fechado" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const temSolicitante = body.solicitanteId !== undefined;
    const temTecnicos = Array.isArray(body.tecnicoIds);
    const temObservadores = Array.isArray(body.observadorIds);

    if (!temSolicitante && !temTecnicos && !temObservadores) {
      return NextResponse.json(
        { error: "Informe ao menos um campo para atualizar" },
        { status: 400 }
      );
    }

    const extraIds = new Set<string>([atual.solicitanteId]);
    atual.usuarios.forEach((u) => extraIds.add(u.usuarioId));

    const solicitanteNumId = temSolicitante ? Number(body.solicitanteId) : null;
    const tecnicoNumIds: number[] | null = temTecnicos
      ? body.tecnicoIds.map(Number).filter((n: number) => !Number.isNaN(n))
      : null;
    const observadorNumIds: number[] | null = temObservadores
      ? body.observadorIds.map(Number).filter((n: number) => !Number.isNaN(n))
      : null;

    const { numToUuid, uuidToNum } = await getHelpdeskUserIdMaps(extraIds);

    let novoSolicitanteUuid: string | undefined;
    if (temSolicitante) {
      if (!solicitanteNumId || Number.isNaN(solicitanteNumId)) {
        return NextResponse.json({ error: "Requerente inválido" }, { status: 400 });
      }
      novoSolicitanteUuid = numToUuid.get(solicitanteNumId);
      if (!novoSolicitanteUuid) {
        return NextResponse.json({ error: "Requerente não encontrado" }, { status: 400 });
      }
    }

    const novosTecnicosUuid =
      tecnicoNumIds !== null
        ? [
            ...new Set(
              tecnicoNumIds
                .map((n) => numToUuid.get(n))
                .filter((id): id is string => !!id)
            ),
          ]
        : null;

    const novosObservadoresUuid =
      observadorNumIds !== null
        ? [
            ...new Set(
              observadorNumIds
                .map((n) => numToUuid.get(n))
                .filter((id): id is string => !!id)
            ),
          ]
        : null;

    if (novosTecnicosUuid !== null && novosTecnicosUuid.length > 0) {
      const atribuidos = await prisma.usuario.findMany({
        where: { id: { in: novosTecnicosUuid } },
        select: { id: true, permissao: true },
      });
      if (atribuidos.length !== novosTecnicosUuid.length) {
        return NextResponse.json(
          { error: "Um ou mais atribuídos não foram encontrados" },
          { status: 400 }
        );
      }
      const semPermissao = atribuidos.filter((u) => !isStaffPermissao(u.permissao));
      if (semPermissao.length > 0) {
        return NextResponse.json(
          {
            error:
              "Atribuído só pode ser usuário com permissão de administrador ou técnico",
          },
          { status: 400 }
        );
      }
    }

    const solicitanteFinal = novoSolicitanteUuid ?? atual.solicitanteId;
    if (novosObservadoresUuid) {
      const filtrados = novosObservadoresUuid.filter((id) => id !== solicitanteFinal);
      novosObservadoresUuid.length = 0;
      novosObservadoresUuid.push(...filtrados);
    }

    const tecnicosAtuais = atual.usuarios
      .filter((u) => u.papel === "tecnico")
      .map((u) => u.usuarioId);
    const observadoresAtuais = atual.usuarios
      .filter((u) => u.papel === "observador")
      .map((u) => u.usuarioId);

    const tecnicosFinal = novosTecnicosUuid ?? tecnicosAtuais;
    const observadoresFinal = novosObservadoresUuid ?? observadoresAtuais;

    const uuidsEvento = new Set<string>([
      atual.solicitanteId,
      solicitanteFinal,
      ...tecnicosAtuais,
      ...tecnicosFinal,
      ...observadoresAtuais,
      ...observadoresFinal,
    ]);
    const usuariosNomes = await prisma.usuario.findMany({
      where: { id: { in: [...uuidsEvento] } },
      select: { id: true, nome: true },
    });
    const nomePorUuid = new Map(usuariosNomes.map((u) => [u.id, u.nome]));
    const nomeAutor = usuario.nome;

    await prisma.$transaction(async (tx) => {
      if (novoSolicitanteUuid && novoSolicitanteUuid !== atual.solicitanteId) {
        await tx.hdChamado.update({
          where: { id: chamadoId },
          data: { solicitanteId: novoSolicitanteUuid },
        });
        await tx.hdChamadoEvento.create({
          data: {
            chamadoId,
            tipo: "statusAlterado",
            autorId: usuario.id,
            texto: textoRequerenteAlterado(
              nomeAutor,
              nomePorUuid.get(novoSolicitanteUuid) ?? "usuário"
            ),
          },
        });
      }

      if (novosTecnicosUuid !== null) {
        const setAtual = new Set(tecnicosAtuais);
        const setNovo = new Set(tecnicosFinal);
        const mudou =
          setAtual.size !== setNovo.size ||
          [...setAtual].some((id) => !setNovo.has(id));

        if (mudou) {
          await tx.hdChamadoUsuario.deleteMany({
            where: { chamadoId, papel: "tecnico" },
          });
          for (const usuarioId of tecnicosFinal) {
            await tx.hdChamadoUsuario.create({
              data: { chamadoId, usuarioId, papel: "tecnico" },
            });
          }

          const removidos = tecnicosAtuais.filter((id) => !setNovo.has(id));
          const adicionados = tecnicosFinal.filter((id) => !setAtual.has(id));

          for (const id of removidos) {
            await tx.hdChamadoEvento.create({
              data: {
                chamadoId,
                tipo: "atribuicao",
                autorId: usuario.id,
                texto: textoAtribuicaoRemovida(
                  nomeAutor,
                  nomePorUuid.get(id) ?? "usuário"
                ),
              },
            });
          }

          for (const id of adicionados) {
            await tx.hdChamadoEvento.create({
              data: {
                chamadoId,
                tipo: "atribuicao",
                autorId: usuario.id,
                texto: textoAtribuicaoAdicionada(
                  nomeAutor,
                  nomePorUuid.get(id) ?? "usuário",
                  id === usuario.id
                ),
              },
            });
          }

          const statusAtual = String(atual.status);
          const novoStatus =
            tecnicosFinal.length > 0 && statusAtual === "aberto"
              ? "atendimento"
              : tecnicosFinal.length === 0 && statusAtual === "atendimento"
                ? "aberto"
                : null;

          if (novoStatus) {
            await tx.hdChamado.update({
              where: { id: chamadoId },
              data: { status: novoStatus as "aberto" | "atendimento" },
            });
            await tx.hdChamadoEvento.create({
              data: {
                chamadoId,
                tipo: "statusAlterado",
                autorId: usuario.id,
                texto:
                  novoStatus === "atendimento"
                    ? textoStatusAtendimento(nomeAutor)
                    : textoStatusAberto(nomeAutor),
              },
            });
          }
        }
      }

      if (novosObservadoresUuid !== null) {
        const setAtual = new Set(observadoresAtuais);
        const setNovo = new Set(observadoresFinal);
        const mudou =
          setAtual.size !== setNovo.size ||
          [...setAtual].some((id) => !setNovo.has(id));

        if (mudou) {
          await tx.hdChamadoUsuario.deleteMany({
            where: { chamadoId, papel: "observador" },
          });
          for (const usuarioId of observadoresFinal) {
            await tx.hdChamadoUsuario.create({
              data: { chamadoId, usuarioId, papel: "observador" },
            });
          }

          const removidos = observadoresAtuais.filter((id) => !setNovo.has(id));
          const adicionados = observadoresFinal.filter((id) => !setAtual.has(id));

          for (const id of removidos) {
            await tx.hdChamadoEvento.create({
              data: {
                chamadoId,
                tipo: "statusAlterado",
                autorId: usuario.id,
                texto: textoObservadorRemovido(
                  nomeAutor,
                  nomePorUuid.get(id) ?? "usuário"
                ),
              },
            });
          }

          for (const id of adicionados) {
            await tx.hdChamadoEvento.create({
              data: {
                chamadoId,
                tipo: "statusAlterado",
                autorId: usuario.id,
                texto: textoObservadorAdicionado(
                  nomeAutor,
                  nomePorUuid.get(id) ?? "usuário"
                ),
              },
            });
          }
        }
      }
    });

    const completo = await prisma.hdChamado.findUnique({
      where: { id: chamadoId },
      include: chamadoInclude,
    });

    if (!completo) {
      return NextResponse.json({ error: "Chamado não encontrado" }, { status: 404 });
    }

    const ids = collectUserIdsFromChamados([completo]);
    const maps = await getHelpdeskUserIdMaps(ids);

    return NextResponse.json({ chamado: mapChamadoApi(completo, maps.uuidToNum, sessao.isStaff) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[helpdesk/chamados/atores PATCH]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
