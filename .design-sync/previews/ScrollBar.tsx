import * as React from "react";
import { ScrollArea, ScrollBar } from "salas-reuniao-ui";

const andares = [
  "Térreo",
  "1º Andar",
  "2º Andar",
  "3º Andar",
  "4º Andar",
  "5º Andar",
  "6º Andar",
  "7º Andar",
  "8º Andar",
  "9º Andar",
  "10º Andar",
];

export function SeletorAndaresHorizontal() {
  return (
    <ScrollArea className="w-80 whitespace-nowrap rounded-md border p-3">
      <div className="flex gap-2">
        {andares.map((andar) => (
          <div key={andar} className="shrink-0 rounded-md border px-3 py-1.5 text-sm">
            {andar}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

const secretarias = [
  "Secretaria de Administração",
  "Secretaria de Finanças",
  "Secretaria de Obras",
  "Secretaria de Saúde",
  "Secretaria de Educação",
  "Secretaria de Tecnologia",
  "Secretaria de Comunicação",
  "Secretaria Jurídica",
  "Secretaria de Recursos Humanos",
  "Secretaria de Planejamento",
];

export function ListaSecretariasVertical() {
  return (
    <ScrollArea className="h-64 w-72 rounded-md border p-3">
      {secretarias.map((secretaria) => (
        <div key={secretaria} className="border-b py-1.5 text-sm last:border-0">
          {secretaria}
        </div>
      ))}
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}
