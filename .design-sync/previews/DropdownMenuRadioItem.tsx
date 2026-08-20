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

export function ItemSelecionado() {
  const [prioridade, setPrioridade] = React.useState("media");
  return (
    <DropdownMenu open>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Prioridade</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel>Definir prioridade</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={prioridade} onValueChange={setPrioridade}>
          <DropdownMenuRadioItem value="baixa">Baixa</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="media">Média</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="alta">Alta</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="urgente" disabled>
            Urgente (bloqueado)
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
