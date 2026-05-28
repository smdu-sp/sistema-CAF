import { IAba } from "@/types/aba";
import { Modulo } from "@/prisma/generated";
import { listarPermissoes } from "@/services/permissoes";
import TabsNavClient from "./client";

export interface TabNav {
  id: string;
  label: string;
}

interface TabsNavProps {
  abas: IAba[];
  modulo: Modulo;
}

export async function TabsNav({ abas, modulo }: TabsNavProps) {
  const permissoes = await listarPermissoes(modulo);
  const permissoesSet = new Set(permissoes);
  const abasFiltradas = abas.filter((aba) => {
    if (!aba.permissao) return true;
    return permissoesSet.has(aba.permissao);
  });
  
  return <TabsNavClient abas={abasFiltradas} />;
}
