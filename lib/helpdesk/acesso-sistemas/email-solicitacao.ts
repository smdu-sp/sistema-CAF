import { enviarEmail } from "@/lib/email/enviar";
import { PRAZO_DIAS_AUTORIZACAO_ACESSO } from "./constants";

export type DadosEmailSolicitacaoAcesso = {
  chamadoId: number;
  nomeBeneficiario: string;
  rfBeneficiario: string;
  sistema: string;
  tipoPermissao: string;
  unidade: string;
  coordenadoria: string;
  observacao: string | null;
  pontoFocalNome: string;
  pontoFocalRf: string;
  linkNegar: string;
};

export async function enviarEmailAutorizacaoAcesso(
  emailDestino: string,
  dados: DadosEmailSolicitacaoAcesso
): Promise<boolean> {
  const linhas = [
    `Foi registrada uma solicitação de acesso a sistema que requer sua ciência.`,
    ``,
    `Chamado: #${dados.chamadoId}`,
    `Beneficiário: ${dados.nomeBeneficiario} (RF ${dados.rfBeneficiario})`,
    `Sistema: ${dados.sistema}`,
    `Tipo de permissão: ${dados.tipoPermissao}`,
    `Unidade / Coordenadoria: ${dados.unidade}${dados.coordenadoria ? ` — ${dados.coordenadoria}` : ""}`,
    `Solicitado por (ponto focal): ${dados.pontoFocalNome} (RF ${dados.pontoFocalRf})`,
  ];

  if (dados.observacao?.trim()) {
    linhas.push(`Observação: ${dados.observacao.trim()}`);
  }

  linhas.push(
    ``,
    `Se a solicitação NÃO for autorizada, acesse o sistema e registre a negativa:`,
    dados.linkNegar,
    ``,
    `Caso não haja negativa em até ${PRAZO_DIAS_AUTORIZACAO_ACESSO} dias, a solicitação será considerada autorizada automaticamente e seguirá para atendimento pela equipe de liberação de acesso.`
  );

  return enviarEmail({
    para: emailDestino,
    assunto: `[Help Desk] Solicitação de acesso — ${dados.sistema} — RF ${dados.rfBeneficiario}`,
    texto: linhas.join("\n"),
  });
}
