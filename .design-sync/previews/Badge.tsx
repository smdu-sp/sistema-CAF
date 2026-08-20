import * as React from "react";
import { Badge } from "salas-reuniao-ui";

export function Default() {
  return <Badge>Novo</Badge>;
}

export function Secondary() {
  return <Badge variant="secondary">Em análise</Badge>;
}

export function Destructive() {
  return <Badge variant="destructive">Cancelada</Badge>;
}

export function Outline() {
  return <Badge variant="outline">Pendente</Badge>;
}

export function Success() {
  return <Badge variant="success">Disponível</Badge>;
}

export function GrupoDeStatus() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Badge variant="success">Disponível</Badge>
      <Badge variant="destructive">Ocupada</Badge>
      <Badge variant="secondary">Em manutenção</Badge>
      <Badge variant="outline">Reservada</Badge>
    </div>
  );
}
