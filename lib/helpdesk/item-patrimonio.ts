export const TIPOS_ITEM_PATRIMONIO = [
  "Computador",
  "Notebook",
  "Impressora",
  "Monitor",
  "Plotter",
  "Scanner",
  "Outro",
] as const;

export const STATUS_ITEM_PATRIMONIO = [
  "Ativo",
  "Manutenção",
  "Estoque",
  "Para Descarte",
  "Baixado",
  "Descartado",
  "Doado",
  "Inativo",
] as const;

export const STATUS_ITEM_META: Record<
  StatusItemPatrimonio,
  { corBg: string; corText: string }
> = {
  Ativo: { corBg: "#D1EBE8", corText: "#0F4F4A" },
  Manutenção: { corBg: "#FCE5D0", corText: "#7A3A0B" },
  Estoque: { corBg: "#D9E1F4", corText: "#0A328D" },
  "Para Descarte": { corBg: "#FBDADA", corText: "#7A1F1F" },
  Baixado: { corBg: "#E8EAF0", corText: "#3D4658" },
  Descartado: { corBg: "#E8EAF0", corText: "#3D4658" },
  Doado: { corBg: "#EEE2F7", corText: "#4F2A70" },
  Inativo: { corBg: "#E8EAF0", corText: "#3D4658" },
};

const STATUS_LEGADO_MAP: Record<string, StatusItemPatrimonio> = {
  ATIVO: "Ativo",
  ESTOQUE: "Estoque",
  BAIXADO: "Baixado",
  DESCARTADO: "Descartado",
  "PARA DESCARTE": "Para Descarte",
  DOADO: "Doado",
  INATIVO: "Inativo",
  MANUTENÇÃO: "Manutenção",
};

export type TipoItemPatrimonio = (typeof TIPOS_ITEM_PATRIMONIO)[number];
export type StatusItemPatrimonio = (typeof STATUS_ITEM_PATRIMONIO)[number];

export function normalizarStatusItem(status: string): StatusItemPatrimonio | string {
  const trimmed = status.trim();
  const legado = STATUS_LEGADO_MAP[trimmed.toUpperCase()];
  if (legado) return legado;
  if (STATUS_ITEM_PATRIMONIO.includes(trimmed as StatusItemPatrimonio)) {
    return trimmed as StatusItemPatrimonio;
  }
  return trimmed;
}

export function metaStatusItem(status: string): { corBg: string; corText: string } {
  const normalizado = normalizarStatusItem(status);
  if (STATUS_ITEM_PATRIMONIO.includes(normalizado as StatusItemPatrimonio)) {
    return STATUS_ITEM_META[normalizado as StatusItemPatrimonio];
  }
  return { corBg: "#FCE5D0", corText: "#7A3A0B" };
}

export type ItemPatrimonioPayload = {
  patrimonio?: string;
  tipo?: string;
  descsbpm?: string;
  numserie?: string | null;
  marca?: string | null;
  modelo?: string | null;
  cimbpm?: string | null;
  nomeRede?: string | null;
  statusitem?: string;
  unidadeId?: string | null;
  servidorId?: string | null;
};

function trimOrNull(v: unknown, max: number): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s) return null;
  return s.slice(0, max);
}

export function parseItemPatrimonioBody(
  body: ItemPatrimonioPayload,
  opts: { partial?: boolean } = {}
): { data?: Record<string, unknown>; error?: string } {
  const partial = opts.partial ?? false;
  const data: Record<string, unknown> = {};

  if (body.patrimonio !== undefined || !partial) {
    const patrimonio =
      typeof body.patrimonio === "string" ? body.patrimonio.trim() : "";
    if (!patrimonio) {
      return { error: "Patrimônio é obrigatório" };
    }
    if (patrimonio.length > 50) {
      return { error: "Patrimônio: máximo 50 caracteres" };
    }
    data.patrimonio = patrimonio;
  }

  if (body.tipo !== undefined || !partial) {
    const tipo = typeof body.tipo === "string" ? body.tipo.trim() : "";
    if (!tipo) {
      return { error: "Tipo é obrigatório" };
    }
    if (!TIPOS_ITEM_PATRIMONIO.includes(tipo as TipoItemPatrimonio)) {
      return { error: "Tipo de equipamento inválido" };
    }
    data.tipo = tipo;
  }

  if (body.descsbpm !== undefined || !partial) {
    const descsbpm =
      typeof body.descsbpm === "string" ? body.descsbpm.trim() : "";
    if (!descsbpm) {
      return { error: "Descrição é obrigatória" };
    }
    if (descsbpm.length > 300) {
      return { error: "Descrição: máximo 300 caracteres" };
    }
    data.descsbpm = descsbpm;
  }

  if (body.numserie !== undefined) {
    data.numserie = trimOrNull(body.numserie, 100);
  } else if (!partial) {
    data.numserie = null;
  }

  if (body.marca !== undefined) {
    data.marca = trimOrNull(body.marca, 100);
  } else if (!partial) {
    data.marca = null;
  }

  if (body.modelo !== undefined) {
    data.modelo = trimOrNull(body.modelo, 100);
  } else if (!partial) {
    data.modelo = null;
  }

  if (body.cimbpm !== undefined) {
    data.cimbpm = trimOrNull(body.cimbpm, 50);
  } else if (!partial) {
    data.cimbpm = null;
  }

  if (body.nomeRede !== undefined) {
    data.nomeRede = trimOrNull(body.nomeRede, 120);
  } else if (!partial) {
    data.nomeRede = null;
  }

  if (body.statusitem !== undefined || !partial) {
    const statusitem =
      typeof body.statusitem === "string" ? body.statusitem.trim() : "Ativo";
    if (!STATUS_ITEM_PATRIMONIO.includes(statusitem as StatusItemPatrimonio)) {
      return { error: "Status inválido" };
    }
    data.statusitem = statusitem;
  }

  if (body.unidadeId !== undefined || !partial) {
    const unidadeId =
      body.unidadeId === null || body.unidadeId === undefined
        ? ""
        : typeof body.unidadeId === "string"
          ? body.unidadeId.trim()
          : "";
    if (!unidadeId) {
      return { error: "Unidade (localização) é obrigatória" };
    }
    data.unidadeId = unidadeId;
  }

  if (body.servidorId !== undefined) {
    if (body.servidorId === null || body.servidorId === "") {
      data.servidorId = null;
    } else if (typeof body.servidorId === "string" && body.servidorId.trim()) {
      data.servidorId = body.servidorId.trim();
    } else {
      return { error: "Servidor inválido" };
    }
  } else if (!partial) {
    data.servidorId = null;
  }

  return { data };
}
