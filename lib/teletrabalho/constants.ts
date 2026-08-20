export const TT_PERMISSOES = {
  visualizar: "teletrabalho.modulo.visualizar",
  cadastros: "teletrabalho.cadastros.gerenciar",
  registro: "teletrabalho.registro.criar",
  validar: "teletrabalho.registro.validar",
  fechamento: "teletrabalho.fechamento.executar",
  relatorios: "teletrabalho.relatorios.emitir",
  adesoes: "teletrabalho.adesoes.gerenciar",
  escala: "teletrabalho.escala.gerenciar",
} as const;

export type TtPapelUnidade = "servidor" | "chefia" | "coordenador" | "caf_dgp";

export const TT_PAPEIS: { valor: TtPapelUnidade; label: string }[] = [
  { valor: "servidor", label: "Servidor" },
  { valor: "chefia", label: "Chefia imediata" },
  { valor: "coordenador", label: "Coordenador" },
  { valor: "caf_dgp", label: "CAF/DGP" },
];
