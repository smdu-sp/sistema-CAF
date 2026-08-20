import { IAba } from "@/types/aba";
import { AE_PERMISSOES } from "@/lib/assinatura-email/constants";

export const abasAssinaturaEmail: IAba[] = [
  {
    url: "/assinatura-email",
    titulo: "Gerar assinatura",
    descricao: "Preencha os dados, visualize, copie ou baixe a assinatura institucional.",
    permissao: "",
  },
  {
    url: "/assinatura-email/setores",
    titulo: "Unidades",
    descricao: "Catálogo de unidades exibidas na assinatura de e-mail.",
    permissao: AE_PERMISSOES.cadastros,
  },
  {
    url: "/assinatura-email/cargos",
    titulo: "Cargos",
    descricao: "Catálogo de cargos exibidos na assinatura de e-mail.",
    permissao: AE_PERMISSOES.cadastros,
  },
  {
    url: "/assinatura-email/ramais",
    titulo: "Ramais",
    descricao: "Ramal de grupo associado ao login do servidor.",
    permissao: AE_PERMISSOES.cadastros,
  },
];
