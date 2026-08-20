import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "salas-reuniao-ui";

export function TituloDeSala() {
  return (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Sala de Reunião 3</CardTitle>
        <CardDescription>3º andar — Bloco B</CardDescription>
      </CardHeader>
    </Card>
  );
}

export function TituloDeCargo() {
  return (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Cargo: Analista de Sistemas</CardTitle>
      </CardHeader>
    </Card>
  );
}
