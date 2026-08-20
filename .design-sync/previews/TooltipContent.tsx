import * as React from "react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Button,
} from "salas-reuniao-ui";

export function TooltipDetalheReserva() {
  return (
    <TooltipProvider>
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            Sala 301
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Ocupada até 15h · Reunião de Diretoria
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
