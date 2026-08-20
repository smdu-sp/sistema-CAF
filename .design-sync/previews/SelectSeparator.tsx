import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "salas-reuniao-ui";

export function SeletorPredioComSeparador() {
  return (
    <Select open value="sede-1">
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Selecione a unidade" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="sede-1">Sede - Torre A</SelectItem>
        <SelectItem value="sede-2">Sede - Torre B</SelectItem>
        <SelectSeparator />
        <SelectItem value="filial-sp">Filial São Paulo</SelectItem>
        <SelectItem value="filial-rj">Filial Rio de Janeiro</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function SeletorStatusComSeparador() {
  return (
    <Select open value="ativo">
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Selecione o status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ativo">Ativo</SelectItem>
        <SelectItem value="inativo">Inativo</SelectItem>
        <SelectSeparator />
        <SelectItem value="todos">Todos</SelectItem>
      </SelectContent>
    </Select>
  );
}
