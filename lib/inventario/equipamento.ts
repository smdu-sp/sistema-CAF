// Constantes e validação do módulo de Inventário de TI (InvEquipamento).
// Espelha o padrão de lib/helpdesk/item-patrimonio.ts.

export const TIPOS_EQUIPAMENTO = [
  "desktop",
  "notebook",
  "servidor",
  "switch",
  "roteador",
  "impressora",
  "storage",
  "outro",
] as const;

export const STATUS_REDE = ["online", "offline", "nunca_visto"] as const;

export const METODOS_COLETA = [
  "winrm",
  "snmp",
  "ssh",
  "manual",
  "import",
  "ping",
] as const;

export type TipoEquipamento = (typeof TIPOS_EQUIPAMENTO)[number];
export type StatusRede = (typeof STATUS_REDE)[number];
export type MetodoColeta = (typeof METODOS_COLETA)[number];

export const TIPO_EQUIPAMENTO_LABEL: Record<TipoEquipamento, string> = {
  desktop: "Desktop",
  notebook: "Notebook",
  servidor: "Servidor",
  switch: "Switch",
  roteador: "Roteador",
  impressora: "Impressora",
  storage: "Storage",
  outro: "Outro",
};

export const STATUS_REDE_META: Record<
  StatusRede,
  { label: string; corBg: string; corText: string }
> = {
  online: { label: "Online", corBg: "#D1EBE8", corText: "#0F4F4A" },
  offline: { label: "Offline", corBg: "#FBDADA", corText: "#7A1F1F" },
  nunca_visto: { label: "Nunca visto", corBg: "#E8EAF0", corText: "#3D4658" },
};

export const METODO_COLETA_LABEL: Record<MetodoColeta, string> = {
  winrm: "WinRM",
  snmp: "SNMP",
  ssh: "SSH",
  manual: "Manual",
  import: "Importação",
  ping: "Ping",
};

export type EquipamentoPayload = {
  tipo?: string;
  hostname?: string | null;
  nome?: string | null;
  ip?: string | null;
  mac?: string | null;
  fabricante?: string | null;
  modelo?: string | null;
  numserie?: string | null;
  so?: string | null;
  soVersao?: string | null;
  soBuild?: string | null;
  usuarioLogado?: string | null;
  dominio?: string | null;
  statusRede?: string;
  unidadeId?: string | null;
  servidorId?: string | null;
  itemId?: number | null;
};

function trimOrNull(v: unknown, max: number): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s) return null;
  return s.slice(0, max);
}

/** Campos string opcionais e seus limites de VarChar. */
const CAMPOS_TEXTO: Record<string, number> = {
  hostname: 200,
  nome: 200,
  ip: 45,
  mac: 20,
  fabricante: 150,
  modelo: 200,
  numserie: 200,
  so: 150,
  soVersao: 80,
  soBuild: 80,
  usuarioLogado: 150,
  dominio: 150,
};

export function parseEquipamentoBody(
  body: EquipamentoPayload,
  opts: { partial?: boolean } = {}
): { data?: Record<string, unknown>; error?: string } {
  const partial = opts.partial ?? false;
  const data: Record<string, unknown> = {};

  if (body.tipo !== undefined || !partial) {
    const tipo = typeof body.tipo === "string" ? body.tipo.trim() : "";
    if (!tipo) {
      return { error: "Tipo é obrigatório" };
    }
    if (!TIPOS_EQUIPAMENTO.includes(tipo as TipoEquipamento)) {
      return { error: "Tipo de equipamento inválido" };
    }
    data.tipo = tipo;
  }

  for (const [campo, max] of Object.entries(CAMPOS_TEXTO)) {
    const valor = (body as Record<string, unknown>)[campo];
    if (valor !== undefined) {
      data[campo] = trimOrNull(valor, max);
    } else if (!partial) {
      data[campo] = null;
    }
  }

  if (body.statusRede !== undefined || !partial) {
    const statusRede =
      typeof body.statusRede === "string" ? body.statusRede.trim() : "nunca_visto";
    if (!STATUS_REDE.includes(statusRede as StatusRede)) {
      return { error: "Status de rede inválido" };
    }
    data.statusRede = statusRede;
  }

  if (body.unidadeId !== undefined) {
    if (body.unidadeId === null || body.unidadeId === "") {
      data.unidadeId = null;
    } else if (typeof body.unidadeId === "string") {
      data.unidadeId = body.unidadeId.trim();
    } else {
      return { error: "Unidade inválida" };
    }
  } else if (!partial) {
    data.unidadeId = null;
  }

  if (body.servidorId !== undefined) {
    if (body.servidorId === null || body.servidorId === "") {
      data.servidorId = null;
    } else if (typeof body.servidorId === "string") {
      data.servidorId = body.servidorId.trim();
    } else {
      return { error: "Servidor inválido" };
    }
  } else if (!partial) {
    data.servidorId = null;
  }

  if (body.itemId !== undefined) {
    if (body.itemId === null) {
      data.itemId = null;
    } else if (typeof body.itemId === "number" && Number.isInteger(body.itemId)) {
      data.itemId = body.itemId;
    } else {
      return { error: "Item de patrimônio inválido" };
    }
  }

  return { data };
}
