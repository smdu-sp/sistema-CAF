import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "salas-reuniao-ui";

export function Basic() {
  return (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Sala de Reunião 3</CardTitle>
        <CardDescription>3º andar — Bloco B</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: 14 }}>Capacidade para 8 pessoas, com TV e videoconferência.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Reservar</Button>
      </CardFooter>
    </Card>
  );
}

export function WithActions() {
  return (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Cargo: Analista de Sistemas</CardTitle>
        <CardDescription>12 servidores vinculados</CardDescription>
      </CardHeader>
      <CardFooter style={{ gap: 8 }}>
        <Button size="sm" variant="outline">
          Editar
        </Button>
        <Button size="sm" variant="destructive">
          Desativar
        </Button>
      </CardFooter>
    </Card>
  );
}
