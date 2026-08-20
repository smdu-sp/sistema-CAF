import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "salas-reuniao-ui";

export function FiltroStatusRamal() {
  return (
    <Select open value="ativo">
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Selecione o status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            Status do Ramal
          </div>
          <SelectItem value="ativo">Ativo</SelectItem>
          <SelectItem value="inativo">Inativo</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectItem value="todos">Todos</SelectItem>
      </SelectContent>
    </Select>
  );
}
