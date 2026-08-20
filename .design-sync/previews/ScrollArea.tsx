import * as React from "react";
import { ScrollArea } from "salas-reuniao-ui";

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

export function ListaSalasDisponiveis() {
  return (
    <ScrollArea className="h-72 w-72 rounded-md border p-4">
      <p className="mb-2 text-sm font-medium leading-none">Salas de Reunião</p>
      {salas.map((sala) => (
        <div key={sala} className="border-b py-1.5 text-sm last:border-0">
          {sala}
        </div>
      ))}
    </ScrollArea>
  );
}

const chamados = [
  { id: "HD-4821", titulo: "Impressora do 3º andar sem toner" },
  { id: "HD-4822", titulo: "Notebook não liga - Setor Financeiro" },
  { id: "HD-4823", titulo: "Solicitação de acesso ao sistema de RH" },
  { id: "HD-4824", titulo: "Troca de monitor - TI Desenvolvimento" },
  { id: "HD-4825", titulo: "Lentidão na rede - Sala 301" },
  { id: "HD-4826", titulo: "Instalação de software contábil" },
  { id: "HD-4827", titulo: "Configuração de e-mail em novo celular" },
  { id: "HD-4828", titulo: "Manutenção de nobreak - Recepção" },
  { id: "HD-4829", titulo: "Solicitação de headset para home office" },
  { id: "HD-4830", titulo: "Reset de senha - Portal do Colaborador" },
];

export function ListaChamadosRecentes() {
  return (
    <ScrollArea className="h-72 w-80 rounded-md border">
      <div className="p-3">
        <p className="mb-2 text-sm font-medium leading-none">Chamados Recentes</p>
        {chamados.map((chamado) => (
          <div key={chamado.id} className="border-b py-2 text-sm last:border-0">
            <span className="font-medium">{chamado.id}</span> — {chamado.titulo}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
