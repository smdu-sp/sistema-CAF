import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  Button,
} from "salas-reuniao-ui";

export function FiltroDeStatus() {
  const [status, setStatus] = React.useState("aberto");
  return (
    <DropdownMenu open>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Status do chamado</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Filtrar por status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
          <DropdownMenuRadioItem value="aberto">Aberto</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="andamento">Em andamento</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="fechado">Fechado</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SelecaoDeTema() {
  const [tema, setTema] = React.useState("sistema");
  return (
    <DropdownMenu open>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Aparência</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Tema</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={tema} onValueChange={setTema}>
          <DropdownMenuRadioItem value="claro">Claro</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="escuro">Escuro</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="sistema">Sistema</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
