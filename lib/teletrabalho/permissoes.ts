import { prisma } from "@/lib/prisma";
import { temAcessoTotalModulos } from "@/lib/permissoes";
import { TT_PERMISSOES, type TtPapelUnidade } from "./constants";

export type AcessoTeletrabalho = {
  usuarioId: string;
  desenvolvedor: boolean;
  acessoTotal: boolean;
  podeVisualizar: boolean;
  podeCadastros: boolean;
  podeRegistrar: boolean;
  podeValidar: boolean;
  podeFechar: boolean;
  podeRelatorios: boolean;
  podeAdesoes: boolean;
  podeEscala: boolean;
  ehCafDgp: boolean;
  servidorId: string | null;
  unidades: {
    id: string;
    nome: string;
    sigla: string;
    papel: TtPapelUnidade;
  }[];
};

async function temPermissaoCatalogo(
  usuarioId: string,
  nome: string,
  acessoTotal: boolean,
): Promise<boolean> {
  if (acessoTotal) return true;
  const vinculo = await prisma.usuarioPermissao.findFirst({
    where: { usuarioId, permissao: { nome } },
  });
  return Boolean(vinculo);
}

export async function obterAcessoTeletrabalho(
  usuarioId: string,
  desenvolvedor: boolean,
  permissaoGlobal: string,
): Promise<AcessoTeletrabalho> {
  const acessoTotal = temAcessoTotalModulos(permissaoGlobal, desenvolvedor);

  const [podeVisualizar, podeCadastros, podeRegistrar, podeValidar, podeFechar, podeRelatorios, podeAdesoes, podeEscala, vinculos, servidor] =
    await Promise.all([
      temPermissaoCatalogo(usuarioId, TT_PERMISSOES.visualizar, acessoTotal),
      temPermissaoCatalogo(usuarioId, TT_PERMISSOES.cadastros, acessoTotal),
      temPermissaoCatalogo(usuarioId, TT_PERMISSOES.registro, acessoTotal),
      temPermissaoCatalogo(usuarioId, TT_PERMISSOES.validar, acessoTotal),
      temPermissaoCatalogo(usuarioId, TT_PERMISSOES.fechamento, acessoTotal),
      temPermissaoCatalogo(usuarioId, TT_PERMISSOES.relatorios, acessoTotal),
      temPermissaoCatalogo(usuarioId, TT_PERMISSOES.adesoes, acessoTotal),
      temPermissaoCatalogo(usuarioId, TT_PERMISSOES.escala, acessoTotal),
      prisma.ttUsuarioUnidade.findMany({
        where: { usuarioId },
        include: { unidade: { select: { id: true, nome: true, sigla: true, ativo: true } } },
      }),
      prisma.ttServidor.findUnique({
        where: { usuarioId },
        select: { id: true, unidadeId: true },
      }),
    ]);

  const unidades = vinculos
    .filter((v) => v.unidade.ativo)
    .map((v) => ({
      id: v.unidade.id,
      nome: v.unidade.nome,
      sigla: v.unidade.sigla,
      papel: v.papel as TtPapelUnidade,
    }));

  const ehCafDgp = acessoTotal || unidades.some((u) => u.papel === "caf_dgp");

  return {
    usuarioId,
    desenvolvedor,
    acessoTotal,
    podeVisualizar: podeVisualizar || acessoTotal || unidades.length > 0 || Boolean(servidor),
    podeCadastros: podeCadastros || acessoTotal || ehCafDgp,
    podeRegistrar: podeRegistrar || acessoTotal || Boolean(servidor) || unidades.some((u) => u.papel === "servidor" || u.papel === "chefia" || u.papel === "coordenador"),
    podeValidar: podeValidar || acessoTotal || unidades.some((u) => u.papel === "chefia" || u.papel === "coordenador"),
    podeFechar: podeFechar || acessoTotal || unidades.some((u) => u.papel === "chefia" || u.papel === "coordenador"),
    podeRelatorios: podeRelatorios || acessoTotal || ehCafDgp || unidades.some((u) => u.papel === "chefia" || u.papel === "coordenador"),
    podeAdesoes: podeAdesoes || acessoTotal || ehCafDgp,
    podeEscala: podeEscala || acessoTotal || unidades.some((u) => u.papel === "chefia" || u.papel === "coordenador") || ehCafDgp,
    ehCafDgp,
    servidorId: servidor?.id ?? null,
    unidades,
  };
}

export function idsUnidadesAcesso(acesso: AcessoTeletrabalho): string[] | null {
  if (acesso.acessoTotal || acesso.ehCafDgp) return null;
  return acesso.unidades.map((u) => u.id);
}

export function podeVerUnidade(acesso: AcessoTeletrabalho, unidadeId: string): boolean {
  if (acesso.acessoTotal || acesso.ehCafDgp) return true;
  return acesso.unidades.some((u) => u.id === unidadeId);
}

export function podeValidarUnidade(acesso: AcessoTeletrabalho, unidadeId: string): boolean {
  if (acesso.acessoTotal) return true;
  return acesso.unidades.some(
    (u) => u.id === unidadeId && (u.papel === "chefia" || u.papel === "coordenador"),
  );
}

export function podeVerRegistro(
  acesso: AcessoTeletrabalho,
  registro: { servidorId: string; unidadeId: string },
): boolean {
  if (acesso.acessoTotal || acesso.ehCafDgp) return true;
  if (acesso.servidorId && registro.servidorId === acesso.servidorId) return true;
  return acesso.unidades.some(
    (u) =>
      u.id === registro.unidadeId &&
      (u.papel === "chefia" || u.papel === "coordenador"),
  );
}
