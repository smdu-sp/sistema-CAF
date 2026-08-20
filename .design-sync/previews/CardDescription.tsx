import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "salas-reuniao-ui";

export function DescricaoDeSala() {
  return (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Sala de Reunião 3</CardTitle>
        <CardDescription>3º andar — Bloco B, capacidade para 8 pessoas</CardDescription>
      </CardHeader>
    </Card>
  );
}

export function DescricaoDeChamado() {
  return (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Chamado #4821</CardTitle>
        <CardDescription>Aberto em 18/08/2026 por Bruno Silva</CardDescription>
      </CardHeader>
    </Card>
  );
}
