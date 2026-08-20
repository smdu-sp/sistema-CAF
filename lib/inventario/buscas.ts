// Fila de solicitações de coleta sob demanda (InvColetaSolicitacao).

export const TIPOS_ALVO = ["host", "subrede"] as const;
export type TipoAlvo = (typeof TIPOS_ALVO)[number];

export const STATUS_SOLICITACAO = [
  "pendente",
  "processando",
  "concluida",
  "erro",
] as const;
export type StatusSolicitacao = (typeof STATUS_SOLICITACAO)[number];

export const STATUS_SOLICITACAO_META: Record<
  StatusSolicitacao,
  { label: string; corBg: string; corText: string }
> = {
  pendente: { label: "Pendente", corBg: "#FCE5D0", corText: "#7A3A0B" },
  processando: { label: "Processando", corBg: "#D9E1F4", corText: "#0A328D" },
  concluida: { label: "Concluída", corBg: "#D1EBE8", corText: "#0F4F4A" },
  erro: { label: "Erro", corBg: "#FBDADA", corText: "#7A1F1F" },
};

export function parseBuscaBody(body: {
  alvo?: unknown;
  tipoAlvo?: unknown;
}): { data?: { alvo: string; tipoAlvo: TipoAlvo }; error?: string } {
  const alvo = typeof body.alvo === "string" ? body.alvo.trim() : "";
  if (!alvo) return { error: "Informe o alvo (hostname, IP ou sub-rede)" };
  if (alvo.length > 200) return { error: "Alvo: máximo 200 caracteres" };

  const tipoAlvo =
    typeof body.tipoAlvo === "string" && TIPOS_ALVO.includes(body.tipoAlvo as TipoAlvo)
      ? (body.tipoAlvo as TipoAlvo)
      : "host";

  return { data: { alvo, tipoAlvo } };
}
