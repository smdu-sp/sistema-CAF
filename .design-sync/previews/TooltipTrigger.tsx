import * as React from "react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Button,
} from "salas-reuniao-ui";

export function IconeAjudaComTooltip() {
  return (
    <TooltipProvider>
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" className="rounded-full">
            ?
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Preencha o número de patrimônio impresso na etiqueta do equipamento
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function BotaoAcaoComTooltip() {
  return (
    <TooltipProvider>
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button size="sm">Aprovar</Button>
        </TooltipTrigger>
        <TooltipContent>
          Aprovar solicitação de teletrabalho de Ana Souza
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
