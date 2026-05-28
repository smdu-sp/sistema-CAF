"use client"

import { IAba } from "@/types/aba";
import Link from "next/link";
import { usePathname } from "next/navigation";


function limpaUrl(url: string) {
  return url.replace("/avaliacao-limpeza", "");
}

export default function TabsNavClient({ abas }: { abas: IAba[] }) {
    const pathname = limpaUrl(usePathname());
    return abas.length > 0 && <div className="w-full flex justify-center mb-6">
      <div className="w-full flex justify-center border border-border rounded-lg">
        <div className="flex gap-1 sm:gap-4 py-1">
          {abas.map((aba, index) => (
            <Link
              key={index}
              href={aba.url}
              className={`
                px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-colors 
                ${pathname == limpaUrl(aba.url) ? "bg-primary text-white" : "text-muted-foreground hover:bg-primary hover:text-white"} 
              `}
            >
              {aba.titulo}
            </Link>
          ))}
        </div>
      </div>
    </div>;
}