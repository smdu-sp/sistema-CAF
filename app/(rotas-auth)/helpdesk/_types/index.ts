export type StatusChamado = 'aberto' | 'atendimento' | 'aguardando' | 'prodam' | 'resolvido' | 'fechado';
export type Prioridade = 'baixa' | 'media' | 'alta' | 'urgente';
export type TipoEvento = 'abertura' | 'atribuicao' | 'resolucao' | 'fechamento' | 'reabertura' | 'statusAlterado';
export type PapelUsuario = 'solicitante' | 'observador' | 'tecnico' | 'participante';
export type TipoMensagem = 'publica' | 'interna' | 'solucao';

export interface Unidade {
  id: string;
  full: string;
  raiz: string;
  sigla: string;
  codigo: string;
  /** Sala física da equipe (cadastro da unidade) */
  sala?: string;
}

export interface Categoria {
  id: number;
  nome: string;
  full: string;
  pai: string;
  filho: string | null;
}

export interface Usuario {
  id: number;
  usuario: string;
  nome: string;
  permissao: number;
  perfil: 'ADM' | 'TEC' | 'USR';
  email: string;
  telefone?: string;
  statususer: 'Ativo' | 'Inativo';
}

export interface ChamadoEvento {
  tipo: TipoEvento;
  autor: number;
  data: string;
  texto: string;
}

export interface Anexo {
  id: number;
  nomeArquivo: string;
  urlArquivo: string;
  tipoMime: string;
  tamanho: number;
}

export interface Mensagem {
  id: number;
  autor: number;
  data: string;
  texto: string;
  tipo: TipoMensagem;
  anexos?: Anexo[];
}

export interface Chamado {
  id: number;
  titulo: string;
  categoria: string;
  status: StatusChamado;
  prioridade: Prioridade;
  solicitante: number;
  abertoEmNomeDe?: number;
  telefone?: string;
  tecnicos: number[];
  observadores: number[];
  unidade: string;
  item: number | null;
  abertura: string;
  dataResolucao?: string;
  dataFechamento?: string;
  prazoConfirmacao?: string;
  avaliacao?: number;
  descricao: string;
  resolucao?: string;
  eventos: ChamadoEvento[];
  mensagens: Mensagem[];
}

export interface ItemPatrimonio {
  idbem: number;
  patrimonio: string;
  tipo: string;
  descsbpm: string;
  numserie: string;
  marca: string;
  modelo: string;
  localizacao: string;
  servidor: string;
  servidorId: number | null;
  cimbpm: string;
  /** Nome do computador na rede */
  nomeRede?: string;
  statusitem: string;
}

export interface TransferenciaItem {
  id: number;
  idItem: number;
  servidorAnterior: string;
  servidorAtual: string;
}

export interface Transferencia {
  id: number;
  dataTransferencia: string;
  idUsuarioRegistro: number;
  idUnidadeDestino: string;
  unidadeDestino: string;
  cimbpm: string;
  observacao: string;
  itens: TransferenciaItem[];
}

export const STATUS_META: Record<StatusChamado, { label: string; cor: string; corBg: string; corText: string }> = {
  aberto:      { label: "Aberto",         cor: "#5CC9BD", corBg: "#D1EBE8", corText: "#0F4F4A" },
  atendimento: { label: "Em atendimento", cor: "#E56E14", corBg: "#FCE5D0", corText: "#7A3A0B" },
  aguardando:  { label: "Aguardando",     cor: "#EDBA94", corBg: "#FBEAD9", corText: "#6E4520" },
  prodam:      { label: "Aguardando PRODAM", cor: "#9A68C0", corBg: "#EEE2F7", corText: "#4F2A70" },
  resolvido:   { label: "Resolvido",      cor: "#0A328D", corBg: "#D9E1F4", corText: "#0A328D" },
  fechado:     { label: "Fechado",        cor: "#8A93A6", corBg: "#E8EAF0", corText: "#3D4658" },
};

export const PRIORIDADE_META: Record<Prioridade, { label: string; corBg: string; corText: string }> = {
  baixa:   { label: "Baixa",   corBg: "#EEF2F7", corText: "#4A5468" },
  media:   { label: "Média",   corBg: "#FBEAD9", corText: "#6E4520" },
  alta:    { label: "Alta",    corBg: "#FCE5D0", corText: "#7A3A0B" },
  urgente: { label: "Urgente", corBg: "#FBDADA", corText: "#7A1F1F" },
};
