export type BaixaPatrimonioPayload = {
  idItem?: number;
  dataBaixa?: string;
  documentoSbpm?: string;
  observacao?: string | null;
};

export function parseBaixaPatrimonioBody(
  body: BaixaPatrimonioPayload
): { data?: Record<string, unknown>; error?: string } {
  const idItem = Number(body.idItem);
  if (!Number.isFinite(idItem) || idItem < 1) {
    return { error: "Item inválido" };
  }

  const documentoSbpm =
    typeof body.documentoSbpm === "string" ? body.documentoSbpm.trim() : "";
  if (!documentoSbpm) {
    return { error: "Documento do sistema de bens é obrigatório" };
  }
  if (documentoSbpm.length > 200) {
    return { error: "Documento: máximo 200 caracteres" };
  }

  let dataBaixa = new Date();
  if (body.dataBaixa !== undefined && body.dataBaixa !== "") {
    const parsed = new Date(body.dataBaixa);
    if (Number.isNaN(parsed.getTime())) {
      return { error: "Data de baixa inválida" };
    }
    dataBaixa = parsed;
  }

  const observacao =
    body.observacao === null || body.observacao === undefined
      ? null
      : typeof body.observacao === "string"
        ? body.observacao.trim() || null
        : null;

  return {
    data: {
      idItem,
      dataBaixa,
      documentoSbpm,
      observacao,
    },
  };
}
