import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "salas-reuniao-ui";

export function SeletorItensPorPagina() {
  return (
    <Select open value="10">
      <SelectTrigger className="h-9 w-[70px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[5, 10, 15, 20, 30, 50].map((opcao) => (
          <SelectItem key={opcao} value={String(opcao)}>
            {opcao}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
];

export function SeletorMesAvaliacao() {
  return (
    <Select open value="Agosto">
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {meses.map((mes) => (
          <SelectItem key={mes} value={mes}>
            {mes}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
