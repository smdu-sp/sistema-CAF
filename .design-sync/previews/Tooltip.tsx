import * as React from "react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Button,
} from "salas-reuniao-ui";

export function TooltipStatusRamal() {
  return (
    <TooltipProvider>
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            Ramal 1010
          </Button>
        </TooltipTrigger>
        <TooltipContent>Ramal ativo · TI Suporte</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
