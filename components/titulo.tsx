"use client";

import { usePathname } from "next/navigation";
import { IAba } from "@/types/aba";

interface TituloProps {
    titulo?: string;
    descricao?: string;
    abas?: IAba[];
}

export default function Titulo({ titulo, descricao, abas }: TituloProps) {
    const pathname = usePathname();
    const abaAtual = abas?.find(aba => pathname.startsWith(aba.url));
    const tituloFinal = abaAtual ? abaAtual.titulo : titulo ?? "";
    const descricaoFinal = abaAtual ? abaAtual.descricao ?? "" : descricao ?? "";
    return (
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
            {tituloFinal}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            {descricaoFinal}
          </p>
        </div>
    );
}
