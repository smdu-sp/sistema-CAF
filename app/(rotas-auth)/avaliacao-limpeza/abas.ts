import { IAba } from "@/types/aba";

export const abasAvaliavaoLimpeza: IAba[] = [
    {
        url: "/avaliacao-limpeza",
        titulo: "Avaliações",
        descricao: "Avaliações de limpeza realizadas nas salas.",
        permissoes: ["avaliacao_limpeza.usuario", "avaliacao_limpeza.admin"]
    },
    {
        url: "/avaliacao-limpeza/categorias",
        titulo: "Categorias",
        descricao: "Categorias de avaliação de limpeza.",
        permissoes: ["avaliacao_limpeza.admin"]
    },
    {
        url: "/avaliacao-limpeza/criterios",
        titulo: "Critérios de Avaliação",
        descricao: "Critérios utilizados para avaliar a limpeza das salas.",
        permissoes: ["avaliacao_limpeza.admin"]
    },
    {
        url: "/avaliacao-limpeza/salas",
        titulo: "Salas",
        descricao: "Salas disponíveis para avaliação de limpeza.",
        permissoes: ["avaliacao_limpeza.admin"]
    }
];
