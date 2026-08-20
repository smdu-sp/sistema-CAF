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
import { Pencil, Copy, Archive, Trash2, UserRound } from "lucide-react";

export function ItensPadrao() {
  return (
    <DropdownMenu open>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Ações do equipamento</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuItem>
          <Pencil /> Editar
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy /> Duplicar
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Archive /> Arquivar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Trash2 /> Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ItemComRecuo() {
  return (
    <DropdownMenu open>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Bruno Lopes</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel inset>Minha conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem inset>
          <UserRound /> Meu perfil
        </DropdownMenuItem>
        <DropdownMenuItem inset>Configurações</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
