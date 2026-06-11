import { prisma } from "@/lib/prisma";
import { enviarEmail } from "@/lib/email/enviar";

export type DadosEmailNegacaoLiberacao = {
  chamadoId: number;
  nomeBeneficiario: string;
  rfBeneficiario: string;
  sistema: string;
  tipoPermissao: string;
  unidade: string;
  coordenadoria: string | null;
  observacao: string | null;
  pontoFocalNome: string;
  pontoFocalRf: string;
  negadoPorNome: string;
  motivoNegacao: string;
  linkChamado: string;
};

/** Destinatários do setor de liberação de acessos. */
export async function resolverEmailsSetorLiberacao(): Promise<string[]> {
  const env = process.env.HD_EMAIL_LIBERACAO_ACESSO?.trim();
  if (env) {
    return env
      .split(/[,;]/)
      .map((e) => e.trim())
      .filter(Boolean);
  }

  const usuarios = await prisma.usuario.findMany({
    where: {
      status: true,
      permissao: { in: ["DEV", "ADM", "SUP"] },
    },
    select: { email: true },
  });

  return [...new Set(usuarios.map((u) => u.email).filter(Boolean))];
}

export async function enviarEmailNegacaoSetorLiberacao(
  dados: DadosEmailNegacaoLiberacao
): Promise<boolean> {
  const destinatarios = await resolverEmailsSetorLiberacao();
  if (destinatarios.length === 0) {
    console.warn(
      "[email] Setor de liberação sem destinatários — configure HD_EMAIL_LIBERACAO_ACESSO"
    );
    return false;
  }

  const linhas = [
    `Uma solicitação de acesso a sistema foi NEGADA pelo coordenador/diretor responsável.`,
    ``,
    `Chamado: #${dados.chamadoId}`,
    `Beneficiário: ${dados.nomeBeneficiario} (RF ${dados.rfBeneficiario})`,
    `Sistema: ${dados.sistema}`,
    `Tipo de permissão: ${dados.tipoPermissao}`,
    `Unidade / Coordenadoria: ${dados.unidade}${dados.coordenadoria ? ` — ${dados.coordenadoria}` : ""}`,
    `Solicitado por (ponto focal): ${dados.pontoFocalNome} (RF ${dados.pontoFocalRf})`,
  ];

  if (dados.observacao?.trim()) {
    linhas.push(`Observação da solicitação: ${dados.observacao.trim()}`);
  }

  linhas.push(
    ``,
    `Negado por: ${dados.negadoPorNome}`,
    `Motivo da negativa: ${dados.motivoNegacao}`,
    ``,
    `Consulte o chamado no sistema:`,
    dados.linkChamado
  );

  return enviarEmail({
    para: destinatarios,
    assunto: `[Help Desk] Acesso negado — ${dados.sistema} — RF ${dados.rfBeneficiario}`,
    texto: linhas.join("\n"),
  });
}
