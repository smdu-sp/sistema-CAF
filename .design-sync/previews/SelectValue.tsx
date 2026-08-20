import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "salas-reuniao-ui";

const salas = [
  { id: "1", nome: "Sala 101 - Auditório Principal" },
  { id: "2", nome: "Sala 203 - Videoconferência" },
  { id: "3", nome: "Sala 301 - Board Room" },
];

export function SeletorSalaComPlaceholder() {
  return (
    <Select open>
      <SelectTrigger className="w-[260px]">
        <SelectValue placeholder="Selecione uma sala" />
      </SelectTrigger>
      <SelectContent>
        {salas.map((sala) => (
          <SelectItem key={sala.id} value={sala.id}>
            {sala.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const setores = [
  { id: "s1", nome: "Administrativo" },
  { id: "s2", nome: "Tecnologia da Informação" },
  { id: "s3", nome: "Recursos Humanos" },
];

export function SeletorUnidadeComPlaceholder() {
  return (
    <Select open>
      <SelectTrigger className="w-full min-w-0 bg-background">
        <SelectValue placeholder="Selecione a unidade" />
      </SelectTrigger>
      <SelectContent side="bottom" className="max-w-[500px]">
        {setores.map((setor) => (
          <SelectItem key={setor.id} value={setor.id}>
            {setor.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
