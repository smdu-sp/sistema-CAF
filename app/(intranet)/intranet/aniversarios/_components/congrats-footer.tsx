/** @format */

"use client";

import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CongratsFooterProps {
  contagem: number;
  enviado: boolean;
  onParabenizar: () => void;
}

export function CongratsFooter({ contagem, enviado, onParabenizar }: CongratsFooterProps) {
  return (
    <div className="mt-3 flex items-center justify-between border-t pt-3">
      <span className="text-xs text-muted-foreground">
        {contagem === 0
          ? "Seja o primeiro a parabenizar"
          : `${contagem} felicitaç${contagem > 1 ? "ões" : "ão"}`}
      </span>
      <Button
        size="sm"
        variant={enviado ? "secondary" : "default"}
        disabled={enviado}
        onClick={onParabenizar}
      >
        <PartyPopper className="size-4" />
        {enviado ? "Parabenizado" : "Parabenizar"}
      </Button>
    </div>
  );
}