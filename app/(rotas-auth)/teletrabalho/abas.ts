import { IAba } from "@/types/aba";
import { TT_PERMISSOES } from "@/lib/teletrabalho/constants";

export const abasTeletrabalho: IAba[] = [
  {
    url: "/teletrabalho",
    titulo: "Início",
    descricao: "Pendências do mês e atalhos do teletrabalho.",
    permissao: TT_PERMISSOES.visualizar,
  },
  {
    url: "/teletrabalho/registro",
    titulo: "Registro",
    descricao: "Lançar atividades do dia de teletrabalho.",
    permissao: TT_PERMISSOES.registro,
  },
  {
    url: "/teletrabalho/validacao",
    titulo: "Validação",
    descricao: "Validar ou devolver registros da equipe.",
    permissao: TT_PERMISSOES.validar,
  },
  {
    url: "/teletrabalho/calendario",
    titulo: "Calendário",
    descricao: "Escala mensal resolvida contra feriados.",
    permissao: TT_PERMISSOES.visualizar,
  },
  {
    url: "/teletrabalho/fechamento",
    titulo: "Fechamento",
    descricao: "Fechar competência e emitir relatórios.",
    permissao: TT_PERMISSOES.fechamento,
  },
  {
    url: "/teletrabalho/unidades",
    titulo: "Unidades",
    descricao: "Cadastro hierárquico de unidades.",
    permissao: TT_PERMISSOES.cadastros,
  },
  {
    url: "/teletrabalho/servidores",
    titulo: "Servidores",
    descricao: "Cadastro de servidores em teletrabalho.",
    permissao: TT_PERMISSOES.cadastros,
  },
  {
    url: "/teletrabalho/cargos",
    titulo: "Cargos",
    descricao: "Cargos por unidade.",
    permissao: TT_PERMISSOES.cadastros,
  },
  {
    url: "/teletrabalho/atividades",
    titulo: "Atividades",
    descricao: "Catálogo de atividades e pontuação por cargo.",
    permissao: TT_PERMISSOES.cadastros,
  },
  {
    url: "/teletrabalho/feriados",
    titulo: "Feriados",
    descricao: "Calendário de feriados do exercício.",
    permissao: TT_PERMISSOES.cadastros,
  },
  {
    url: "/teletrabalho/adesoes",
    titulo: "Adesões",
    descricao: "Metadados dos termos de adesão e desligamento.",
    permissao: TT_PERMISSOES.adesoes,
  },
  {
    url: "/teletrabalho/escala",
    titulo: "Escala",
    descricao: "Regime de rodízio e grupos da unidade.",
    permissao: TT_PERMISSOES.escala,
  },
];
