import * as React from "react";
import { Input, Label } from "salas-reuniao-ui";

export function Padrao() {
  return <Input placeholder="usuario@prefeitura.sp.gov.br" style={{ width: 280 }} />;
}

export function ComLabel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: 280 }}>
      <Label htmlFor="email-input">E-mail institucional</Label>
      <Input id="email-input" type="email" placeholder="usuario@prefeitura.sp.gov.br" />
    </div>
  );
}

export function Desabilitado() {
  return <Input disabled value="Não editável" style={{ width: 280 }} readOnly />;
}

export function Numero() {
  return <Input type="number" placeholder="Capacidade da sala" style={{ width: 280 }} />;
}
