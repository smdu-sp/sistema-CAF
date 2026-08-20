import * as React from "react";
import { Textarea, Label } from "salas-reuniao-ui";

export function Padrao() {
  return <Textarea placeholder="Escreva um comunicado curto..." style={{ width: 320 }} />;
}

export function ComLabel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: 320 }}>
      <Label htmlFor="descricao-chamado">Descrição do chamado</Label>
      <Textarea
        id="descricao-chamado"
        placeholder="Descreva o problema encontrado no equipamento..."
      />
    </div>
  );
}

export function Desabilitado() {
  return <Textarea disabled value="Campo bloqueado para edição" style={{ width: 320 }} readOnly />;
}
