import * as React from "react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Button,
} from "salas-reuniao-ui";

export function BarraAcoesComTooltips() {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Editar
            </Button>
          </TooltipTrigger>
          <TooltipContent>Editar chamado HD-4821</TooltipContent>
        </Tooltip>
        <Tooltip open>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Excluir
            </Button>
          </TooltipTrigger>
          <TooltipContent>Excluir chamado permanentemente</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
