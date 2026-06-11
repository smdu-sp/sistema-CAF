/** Prazo para autorização tácita pelo coordenador/diretor (sem negativa). */
export const PRAZO_DIAS_AUTORIZACAO_ACESSO = 7;

export function limiteDataAutorizacaoTacita(): Date {
  const limite = new Date();
  limite.setDate(limite.getDate() - PRAZO_DIAS_AUTORIZACAO_ACESSO);
  return limite;
}
