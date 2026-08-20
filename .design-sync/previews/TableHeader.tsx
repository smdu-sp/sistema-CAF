import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "salas-reuniao-ui";

export function CabecalhoSalas() {
  return (
    <Table style={{ width: 480 }}>
      <TableHeader>
        <TableRow>
          <TableHead>Sala</TableHead>
          <TableHead>Andar</TableHead>
          <TableHead>Capacidade</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Sala 305</TableCell>
          <TableCell>3º andar</TableCell>
          <TableCell>8 pessoas</TableCell>
          <TableCell>Disponível</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Sala de Reunião A</TableCell>
          <TableCell>Térreo</TableCell>
          <TableCell>10 pessoas</TableCell>
          <TableCell>Ocupada</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
