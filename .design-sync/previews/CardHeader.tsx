import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "salas-reuniao-ui";

export function Basico() {
  return (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Sala de Reunião 3</CardTitle>
        <CardDescription>3º andar — Bloco B</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: 14, margin: 0 }}>Capacidade para 8 pessoas.</p>
      </CardContent>
    </Card>
  );
}

export function SoTitulo() {
  return (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Chamado #4821</CardTitle>
      </CardHeader>
    </Card>
  );
}
