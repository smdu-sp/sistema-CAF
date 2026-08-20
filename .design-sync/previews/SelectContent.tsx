import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "salas-reuniao-ui";

const andares = ["Térreo", "1º Andar", "2º Andar", "3º Andar", "4º Andar"];

export function SeletorAndar() {
  return (
    <Select open value="2º Andar">
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Selecione o andar" />
      </SelectTrigger>
      <SelectContent>
        {andares.map((andar) => (
          <SelectItem key={andar} value={andar}>
            {andar}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
