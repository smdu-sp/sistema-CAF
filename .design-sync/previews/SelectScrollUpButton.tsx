import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "salas-reuniao-ui";

const salas = [
  "Sala 101 - Auditório Principal",
  "Sala 102 - Reunião Rápida",
  "Sala 103 - Diretoria",
  "Sala 201 - Treinamento A",
  "Sala 202 - Treinamento B",
  "Sala 203 - Videoconferência",
  "Sala 301 - Board Room",
  "Sala 302 - Workshop",
  "Sala 303 - Entrevistas",
  "Sala 401 - Comitê Executivo",
  "Sala 402 - Integração",
  "Sala 403 - Brainstorm",
  "Sala 501 - Reunião 1:1",
  "Sala 502 - Squad Ágil",
  "Sala 503 - Cliente Externo",
];

export function SeletorSalaListaLongaFinal() {
  return (
    <Select open value={salas[salas.length - 1]}>
      <SelectTrigger className="w-[260px]">
        <SelectValue placeholder="Selecione uma sala" />
      </SelectTrigger>
      <SelectContent>
        {salas.map((sala) => (
          <SelectItem key={sala} value={sala}>
            {sala}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const ramais = [
  "1001 - Recepção",
  "1002 - Portaria",
  "1010 - TI Suporte",
  "1011 - TI Infraestrutura",
  "1020 - RH",
  "1021 - Financeiro",
  "1030 - Diretoria",
  "1031 - Jurídico",
  "1040 - Comunicação",
  "1041 - Marketing",
  "1050 - Compras",
  "1051 - Almoxarifado",
];

export function SeletorRamalListaLongaFinal() {
  return (
    <Select open value={ramais[ramais.length - 1]}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Selecione um ramal" />
      </SelectTrigger>
      <SelectContent>
        {ramais.map((ramal) => (
          <SelectItem key={ramal} value={ramal}>
            {ramal}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
