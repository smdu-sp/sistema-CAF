import { IAba } from "@/types/aba";

export const abasAvaliacaoLimpeza: IAba[] = [
  {
    url: "/avaliacao-limpeza",
    titulo: "Avaliações",
    descricao: "Avaliações de limpeza realizadas nas salas.",
    permissao: "avaliacao_limpeza.avaliacoes.visualizar",
  },
  {
    url: "/avaliacao-limpeza/categorias",
    titulo: "Categorias",
    descricao: "Categorias de avaliação de limpeza.",
    permissao: "avaliacao_limpeza.categorias.visualizar",
  },
  {
    url: "/avaliacao-limpeza/criterios",
    titulo: "Critérios de Avaliação",
    descricao: "Critérios utilizados para avaliar a limpeza das salas.",
    permissao: "avaliacao_limpeza.criterios.visualizar",
  },
  {
    url: "/avaliacao-limpeza/salas",
    titulo: "Salas",
    descricao: "Salas disponíveis para avaliação de limpeza.",
    permissao: "avaliacao_limpeza.salas.visualizar",
  },
];
