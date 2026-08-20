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

export function SeletorSetorAgrupado() {
  return (
    <Select open value="ti">
      <SelectTrigger className="w-[240px]">
        <SelectValue placeholder="Selecione o setor" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            Tecnologia
          </div>
          <SelectItem value="ti">TI - Infraestrutura</SelectItem>
          <SelectItem value="dev">TI - Desenvolvimento</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            Administrativo
          </div>
          <SelectItem value="rh">Recursos Humanos</SelectItem>
          <SelectItem value="financeiro">Financeiro</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function SeletorPredioAgrupado() {
  return (
    <Select open value="sede-1">
      <SelectTrigger className="w-[240px]">
        <SelectValue placeholder="Selecione a unidade" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            Sede
          </div>
          <SelectItem value="sede-1">Sede - Torre A</SelectItem>
          <SelectItem value="sede-2">Sede - Torre B</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            Filiais
          </div>
          <SelectItem value="filial-sp">Filial São Paulo</SelectItem>
          <SelectItem value="filial-rj">Filial Rio de Janeiro</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
