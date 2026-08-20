import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  Button,
} from "salas-reuniao-ui";
import { UserRound, Settings, LogOut } from "lucide-react";

export function LabelComDetalhes() {
  return (
    <DropdownMenu open>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Bruno Lopes</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div>
            <p className="text-sm font-semibold">Bruno Lopes</p>
            <p className="text-xs font-normal text-muted-foreground">
              Analista de Sistemas · TI
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserRound /> Meu perfil
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings /> Configurações
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LabelSimplesComRecuo() {
  return (
    <DropdownMenu open>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Chamados</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel inset>Filtrar por status</DropdownMenuLabel>
        <DropdownMenuItem inset>Aberto</DropdownMenuItem>
        <DropdownMenuItem inset>Em andamento</DropdownMenuItem>
        <DropdownMenuItem inset>Fechado</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
