import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
  Button,
} from "salas-reuniao-ui";
import { UserRound, Settings, ShieldCheck, Users, LogOut } from "lucide-react";

export function GruposDeAcoes() {
  return (
    <DropdownMenu open>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Bruno Lopes</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserRound /> Meu perfil
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings /> Configurações
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Administração</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Users /> Gerenciar servidores
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShieldCheck /> Permissões
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
