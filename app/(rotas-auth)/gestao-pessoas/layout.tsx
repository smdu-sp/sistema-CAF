import { TabsNav } from "@/components/tabs-nav";
import { abasGestaoPessoas } from "./abas";
import Titulo from "@/components/titulo";
import { validarPermissao } from "@/services/permissoes";
import { GP_PERMISSOES } from "@/lib/gestao-pessoas/constants";
import { redirect } from "next/navigation";

export default async function LayoutGestaoPessoas({
  children,
}: {
  children: React.ReactNode;
}) {
  const temPermissao = await validarPermissao(GP_PERMISSOES.visualizar);
  if (!temPermissao) redirect("/");

  return (
    <div className="w-full h-full flex flex-col">
      <TabsNav abas={abasGestaoPessoas} modulo="gestao_pessoas" />
      <Titulo abas={abasGestaoPessoas} />
      {children}
    </div>
  );
}
