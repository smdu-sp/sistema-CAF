export type TipoEventoHistorico =
  | "abertura"
  | "atribuicao"
  | "resolucao"
  | "fechamento"
  | "reabertura"
  | "statusAlterado";

export type EventoHistoricoInput = {
  tipo: TipoEventoHistorico;
  autor: number;
  data: string;
  texto: string;
};

/** Textos gravados ao registrar eventos (sempre com nome de quem executou a ação). */
export function textoAbertura(nomeAutor: string): string {
  return `${nomeAutor} abriu o chamado`;
}

export function textoAtribuicaoAdicionada(
  nomeAutor: string,
  alvoNome: string,
  mesmoUsuario: boolean
): string {
  if (mesmoUsuario) {
    return `${nomeAutor} atribuiu o chamado a si mesmo`;
  }
  return `${nomeAutor} atribuiu o chamado para ${alvoNome}`;
}

export function textoAtribuicaoRemovida(nomeAutor: string, alvoNome: string): string {
  return `${nomeAutor} removeu a atribuição de ${alvoNome}`;
}

export function textoRequerenteAlterado(nomeAutor: string, novoNome: string): string {
  return `${nomeAutor} alterou o requerente para ${novoNome}`;
}

export function textoObservadorAdicionado(nomeAutor: string, alvoNome: string): string {
  return `${nomeAutor} adicionou ${alvoNome} como observador`;
}

export function textoObservadorRemovido(nomeAutor: string, alvoNome: string): string {
  return `${nomeAutor} removeu ${alvoNome} dos observadores`;
}

export function textoResolucao(nomeAutor: string): string {
  return `${nomeAutor} resolveu o chamado`;
}

export function textoStatusProdam(nomeAutor: string): string {
  return `${nomeAutor} alterou o status para Aguardando PRODAM`;
}

export function textoConfirmacaoSolucao(nomeAutor: string): string {
  return `${nomeAutor} confirmou que o chamado foi solucionado`;
}

export function textoReabertura(nomeAutor: string): string {
  return `${nomeAutor} informou que o chamado não foi solucionado`;
}

export function textoAvaliacao(nomeAutor: string, estrelas: number): string {
  const sufixo = estrelas === 1 ? "estrela" : "estrelas";
  return `${nomeAutor} avaliou o chamado com ${estrelas} ${sufixo}`;
}

export function textoFechamentoAutomatico(): string {
  return "Sistema fechou o chamado automaticamente após 7 dias sem retorno do solicitante";
}

const AVALIACAO_NOVO = /avaliou o chamado com (\d) estrela/i;
const AVALIACAO_LEGADO = /^Avaliação do solicitante:\s*(\d)\s*estrelas?$/i;

export function extrairNotaAvaliacaoEvento(texto: string): number | undefined {
  const t = texto.trim();
  const m = t.match(AVALIACAO_NOVO) ?? t.match(AVALIACAO_LEGADO);
  if (!m) return undefined;
  const n = Number(m[1]);
  return n >= 1 && n <= 5 ? n : undefined;
}

/** Exibição do histórico: normaliza registros antigos sem nome do autor no texto. */
export function formatEventoHistorico(
  evento: EventoHistoricoInput,
  nomeAutor?: string
): string {
  const t = evento.texto.trim();
  if (!nomeAutor) return t;
  if (t.toLowerCase().startsWith(nomeAutor.toLowerCase())) return t;
  if (t.startsWith("Sistema ")) return t;

  const legado = legadoParaTexto(evento.tipo, t, nomeAutor);
  if (legado) return legado;

  return `${nomeAutor}: ${t}`;
}

function legadoParaTexto(
  tipo: TipoEventoHistorico,
  texto: string,
  nomeAutor: string
): string | null {
  if (texto === "Chamado aberto") return textoAbertura(nomeAutor);
  if (texto === "Chamado resolvido") return textoResolucao(nomeAutor);
  if (texto === "Solicitante confirmou solução") return textoConfirmacaoSolucao(nomeAutor);
  if (texto === "Solicitante informou que o chamado não foi solucionado") {
    return textoReabertura(nomeAutor);
  }
  if (texto === "Status alterado para Aguardando PRODAM") {
    return textoStatusProdam(nomeAutor);
  }
  if (texto === "Atribuição removida") {
    return `${nomeAutor} removeu a atribuição do chamado`;
  }
  if (texto === "Observadores removidos") {
    return `${nomeAutor} removeu todos os observadores`;
  }

  const mAtrib = texto.match(/^Atribuído a (.+)$/i);
  if (tipo === "atribuicao" && mAtrib) {
    return `${nomeAutor} atribuiu o chamado para ${mAtrib[1]}`;
  }

  const mReq = texto.match(/^Requerente alterado para (.+)$/i);
  if (mReq) return textoRequerenteAlterado(nomeAutor, mReq[1]);

  const mObs = texto.match(/^Observadores: (.+)$/i);
  if (mObs) return `${nomeAutor} definiu observadores: ${mObs[1]}`;

  const mAval = texto.match(AVALIACAO_LEGADO);
  if (mAval) return textoAvaliacao(nomeAutor, Number(mAval[1]));

  return null;
}
