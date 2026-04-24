"use client";

import { IAba } from "@/types/aba";
import { usePathname } from "next/navigation";
import Link from "next/link";

export interface TabNav {
  id: string;
  label: string;
}

interface TabsNavProps {
  abas: IAba[];
}

export function TabsNav({ abas }: TabsNavProps) {
  const pathname = usePathname().replace("/avaliacao-limpeza", "");
  return (
    <div className="w-full flex justify-center mb-6">
      <div className="w-full flex justify-center border border-border rounded-lg">
        <div className="flex gap-1 sm:gap-4 py-1">
          {abas.map((aba, index) => (
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
