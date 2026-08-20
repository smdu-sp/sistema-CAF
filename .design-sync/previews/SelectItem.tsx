import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "salas-reuniao-ui";

export function SeletorCriterioLimpeza() {
  return (
    <Select open value="BOM">
      <SelectTrigger className="h-8 w-[200px]">
        <SelectValue placeholder="Selecione um critério" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="RUIM">Ruim</SelectItem>
        <SelectItem value="REGULAR">Regular</SelectItem>
        <SelectItem value="BOM">Bom</SelectItem>
        <SelectItem value="OTIMO">Ótimo</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function SeletorStatusChamado() {
  return (
    <Select open value="andamento">
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Selecione o status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="aberto">Aberto</SelectItem>
        <SelectItem value="andamento">Em Andamento</SelectItem>
        <SelectItem value="resolvido">Resolvido</SelectItem>
        <SelectItem value="fechado">Fechado</SelectItem>
      </SelectContent>
    </Select>
  );
}
