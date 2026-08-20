import * as React from "react";
import { Card, CardHeader, CardTitle, CardFooter, Button } from "salas-reuniao-ui";

export function ComBotaoDeAcao() {
  return (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Sala de Reunião 3</CardTitle>
      </CardHeader>
      <CardFooter>
        <Button size="sm">Reservar</Button>
      </CardFooter>
    </Card>
  );
}

export function ComDuasAcoes() {
  return (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Cargo: Analista de Sistemas</CardTitle>
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
