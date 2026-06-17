import { prisma } from "@/lib/prisma";
import { GP_PERMISSOES, prefixoEh, type GpPapelUnidade } from "./constants";

export type AcessoGestaoPessoas = {
  podeVisualizar: boolean;
  podeImportar: boolean;
  podeImprimir: boolean;
  podeGerenciarPermissoes: boolean;
  ehDgp: boolean;
  prefixosPermitidos: string[];
  unidades: {
    id: string;
    codigoEh: string;
    prefixoEh: string;
    nome: string;
    papel: GpPapelUnidade;
  }[];
};

async function usuarioTemPermissao(
  usuarioId: string,
  nomePermissao: string,
  desenvolvedor: boolean
): Promise<boolean> {
  if (desenvolvedor) return true;
  const vinculo = await prisma.usuarioPermissao.findFirst({
    where: {
      usuarioId,
      permissao: { nome: nomePermissao },
    },
  });
  return Boolean(vinculo);
}

export async function obterAcessoGestaoPessoas(
  usuarioId: string,
  desenvolvedor = false
): Promise<AcessoGestaoPessoas> {
  const [podeVisualizar, podeImportar, podeImprimir, podeGerenciarPermissoes, vinculos] =
    await Promise.all([
      usuarioTemPermissao(usuarioId, GP_PERMISSOES.visualizar, desenvolvedor),
      usuarioTemPermissao(usuarioId, GP_PERMISSOES.importar, desenvolvedor),
      usuarioTemPermissao(usuarioId, GP_PERMISSOES.imprimir, desenvolvedor),
      usuarioTemPermissao(
        usuarioId,
        GP_PERMISSOES.gerenciarPermissoes,
        desenvolvedor
      ),
      prisma.gpUsuarioUnidade.findMany({
        where: { usuarioId },
        include: { unidade: true },
      }),
    ]);

  const ehDgp =
    desenvolvedor || vinculos.some((v) => v.papel === "dgp");

  const unidades = vinculos.map((v) => ({
    id: v.unidade.id,
    codigoEh: v.unidade.codigoEh,
    prefixoEh: v.unidade.prefixoEh,
    nome: v.unidade.nome,
    papel: v.papel as GpPapelUnidade,
  }));

  const prefixosPermitidos = ehDgp
    ? []
    : [...new Set(unidades.map((u) => u.prefixoEh))];

  return {
    podeVisualizar: podeVisualizar || desenvolvedor,
    podeImportar:
      podeImportar ||
      desenvolvedor ||
      vinculos.some((v) => v.papel === "administrador" || v.papel === "dgp"),
    podeImprimir:
      podeImprimir ||
      desenvolvedor ||
      vinculos.length > 0,
    podeGerenciarPermissoes:
      podeGerenciarPermissoes ||
      desenvolvedor ||
      vinculos.some((v) => v.papel === "administrador" || v.papel === "dgp"),
    ehDgp,
    prefixosPermitidos,
    unidades,
  };
}

export function usuarioPodeAcessarPrefixoEh(
  acesso: AcessoGestaoPessoas,
  prefixo: string
): boolean {
  if (acesso.ehDgp) return true;
  return acesso.prefixosPermitidos.includes(prefixoEh(prefixo));
}

export async function garantirUnidadeEh(
  codigoEh: string,
  nomeUnidade: string
): Promise<void> {
  const prefixo = prefixoEh(codigoEh);
  await prisma.gpUnidade.upsert({
    where: { codigoEh },
    create: { codigoEh, prefixoEh: prefixo, nome: nomeUnidade },
    update: { nome: nomeUnidade, prefixoEh: prefixo },
  });
}
