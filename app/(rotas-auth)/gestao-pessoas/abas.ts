import { IAba } from "@/types/aba";
import { GP_PERMISSOES } from "@/lib/gestao-pessoas/constants";

export const abasGestaoPessoas: IAba[] = [
  {
    url: "/gestao-pessoas/folha-ponto",
    titulo: "Folha de Ponto",
    descricao: "Impressão da Folha de Frequência Individual (FFI).",
    permissao: GP_PERMISSOES.imprimir,
  },
  {
    url: "/gestao-pessoas/servidores",
    titulo: "Servidores",
    descricao: "Consulta de servidores por competência.",
    permissao: GP_PERMISSOES.visualizar,
  },
  {
    url: "/gestao-pessoas/importacao",
    titulo: "Importação SIGPEG",
    descricao: "Carga mensal do arquivo de servidores.",
    permissao: GP_PERMISSOES.importar,
  },
  {
    url: "/gestao-pessoas/permissoes",
    titulo: "Permissões por Unidade",
    descricao: "Vincular usuários às unidades (EH).",
    permissao: GP_PERMISSOES.gerenciarPermissoes,
  },
];
