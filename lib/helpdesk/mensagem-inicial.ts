export type MensagemInicialChamadoParams = {
  descricaoUsuario: string;
  loginUsuario: string;
  nomeMaquina?: string | null;
  telefone?: string | null;
  sala?: string | null;
};

/** Texto da primeira mensagem pública do solicitante ao abrir o chamado. */
export function montarMensagemInicialChamado(
  p: MensagemInicialChamadoParams
): string {
  const desc = p.descricaoUsuario.trim() || "—";
  return [
    `Descrição do problema: ${desc}`,
    "",
    `Usuário: ${p.loginUsuario.trim()}`,
    `Máquina: ${p.nomeMaquina?.trim() || "—"}`,
    `Telefone: ${p.telefone?.trim() || "—"}`,
    `Sala: ${p.sala?.trim() || "—"}`,
    "",
  ].join("\n");
}

export function nomeMaquinaItemPatrimonio(item: {
  tipo: string;
  nomeRede?: string | null;
}): string | null {
  if (item.tipo.trim().toLowerCase() !== "computador") return null;
  return item.nomeRede?.trim() || null;
}
