import * as React from "react";
import { Label, Input } from "salas-reuniao-ui";

export function ComInput() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: 260 }}>
      <Label htmlFor="nome-servidor">Nome do servidor</Label>
      <Input id="nome-servidor" placeholder="Bruno Silva" />
    </div>
  );
}

export function Simples() {
  return <Label>Cargo</Label>;
}
