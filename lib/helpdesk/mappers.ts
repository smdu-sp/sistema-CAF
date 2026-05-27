import type { Prisma } from "../../prisma/generated";
import { extrairNotaAvaliacaoEvento } from "./eventos";
import { mapPermissaoToPerfil } from "./session";

type UsuarioRow = {
  id: string;
  login: string;
  nome: string;
  permissao: string;
  email: string;
  telefone: string | null;
  status: boolean;
};

export const chamadoInclude = {
  solicitante: true,
  abertoEmNomeDe: true,
  categoria: true,
  unidade: true,
  item: { include: { unidade: true, servidor: true } },
  usuarios: { include: { usuario: true } },
  eventos: { include: { autor: true }, orderBy: { criadoEm: "asc" as const } },
  mensagens: {
    include: { autor: true, anexos: true },
    orderBy: { criadoEm: "asc" as const },
  },
} satisfies Prisma.HdChamadoInclude;

export type ChamadoComRelacoes = Prisma.HdChamadoGetPayload<{
  include: typeof chamadoInclude;
}>;

export function buildUserIdMaps(userIds: Iterable<string>) {
  const uuidToNum = new Map<string, number>();
  const numToUuid = new Map<number, string>();
  [...new Set(userIds)].sort().forEach((uuid, i) => {
    const n = i + 1;
    uuidToNum.set(uuid, n);
    numToUuid.set(n, uuid);
  });
  return { uuidToNum, numToUuid };
}

export function collectUserIdsFromChamados(chamados: ChamadoComRelacoes[]): Set<string> {
  const ids = new Set<string>();
  for (const c of chamados) {
    ids.add(c.solicitanteId);
    if (c.abertoEmNomeDeId) ids.add(c.abertoEmNomeDeId);
    c.usuarios.forEach((u) => ids.add(u.usuarioId));
    c.eventos.forEach((e) => ids.add(e.autorId));
    c.mensagens.forEach((m) => {
      ids.add(m.autorId);
      m.anexos.forEach((a) => ids.add(a.autorId));
    });
  }
  return ids;
}

export function mapUsuarioApi(u: UsuarioRow, uuidToNum: Map<string, number>) {
  const perfil = mapPermissaoToPerfil(u.permissao);
  return {
    id: uuidToNum.get(u.id)!,
    usuario: u.login,
    nome: u.nome,
    permissao: perfil === "ADM" ? 1 : perfil === "TEC" ? 2 : 3,
    perfil,
    email: u.email,
    telefone: u.telefone ?? undefined,
    statususer: u.status ? ("Ativo" as const) : ("Inativo" as const),
  };
}

export function mapChamadoApi(
  c: ChamadoComRelacoes,
  uuidToNum: Map<string, number>,
  isStaff = true
) {
  const categoriaLabel = c.categoria.filho
    ? `${c.categoria.pai} > ${c.categoria.filho}`
    : c.categoria.pai;
  const eventoAvaliacao = [...c.eventos]
    .reverse()
    .find((e) => extrairNotaAvaliacaoEvento(e.texto) !== undefined);
  const avaliacao = eventoAvaliacao
    ? extrairNotaAvaliacaoEvento(eventoAvaliacao.texto)
    : undefined;
  const prazoConfirmacao =
    c.status === "resolvido" && c.dataResolucao
      ? new Date(c.dataResolucao.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
      : undefined;

  return {
    id: c.id,
    titulo: c.titulo,
    categoria: categoriaLabel,
    status: c.status as string,
    prioridade: c.prioridade as string,
    solicitante: uuidToNum.get(c.solicitanteId)!,
    abertoEmNomeDe: c.abertoEmNomeDeId
      ? uuidToNum.get(c.abertoEmNomeDeId)
      : undefined,
    telefone: c.telefone ?? undefined,
    tecnicos: c.usuarios
      .filter((u) => u.papel === "tecnico")
      .map((u) => uuidToNum.get(u.usuarioId)!),
    observadores: c.usuarios
      .filter((u) => u.papel === "observador")
      .map((u) => uuidToNum.get(u.usuarioId)!),
    unidade: c.unidade.nome,
    item: c.itemId ?? null,
    abertura: c.abertura.toISOString(),
    dataResolucao: c.dataResolucao?.toISOString(),
    dataFechamento: c.dataFechamento?.toISOString(),
    prazoConfirmacao,
    avaliacao,
    descricao: c.descricao,
    resolucao: c.resolucao ?? undefined,
    eventos: isStaff
      ? c.eventos.map((e) => ({
          tipo: e.tipo as string,
          autor: uuidToNum.get(e.autorId)!,
          data: e.criadoEm.toISOString(),
          texto: e.texto,
        }))
      : [],
    mensagens: (isStaff ? c.mensagens : c.mensagens.filter((m) => m.tipo !== "interna")).map((m) => ({
      id: m.id,
      autor: uuidToNum.get(m.autorId)!,
      data: m.criadoEm.toISOString(),
      texto: m.texto,
      tipo: m.tipo as string,
      anexos: m.anexos.map((a) => ({
        id: a.id,
        nomeArquivo: a.nomeArquivo,
        urlArquivo: a.urlArquivo,
        tipoMime: a.tipoMime,
        tamanho: a.tamanho,
      })),
    })),
  };
}
