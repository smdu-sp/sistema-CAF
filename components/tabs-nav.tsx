"use client";

import { IAba } from "@/types/aba";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Session } from "next-auth";

export interface TabNav {
  id: string;
  label: string;
}

interface TabsNavProps {
  abas: IAba[];
  session?: Session | null;
}

export function TabsNav({ abas, session }: TabsNavProps) {
  const pathname = usePathname().replace("/avaliacao-limpeza", "");

  // Obter a permissão do usuário
  const usuarioPermissao = (session as any)?.usuario?.permissao || "";

  // Filtrar abas pela permissão do usuário
  const abasFiltradas = abas.filter((aba) => aba.permissoes.includes(usuarioPermissao));

  return (
    <div className="w-full flex justify-center mb-6">
      <div className="w-full flex justify-center border border-border rounded-lg">
        <div className="flex gap-1 sm:gap-4 py-1">
          {abasFiltradas.map((aba, index) => (
            <Link
              key={index}
              href={aba.url}
              className={`
                px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-colors 
                ${pathname == aba.url.replace("/avaliacao-limpeza", "") ? "bg-primary text-white" : "text-muted-foreground hover:bg-primary hover:text-white"} 
              `}
            >
              {aba.titulo}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
