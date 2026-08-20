import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge } from "salas-reuniao-ui";

export function ListaDeSalas() {
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
          <TableCell>Sala 101</TableCell>
          <TableCell>1º andar</TableCell>
          <TableCell>6 pessoas</TableCell>
          <TableCell>Disponível</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Sala 202</TableCell>
          <TableCell>2º andar</TableCell>
          <TableCell>12 pessoas</TableCell>
          <TableCell>Ocupada</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Auditório</TableCell>
          <TableCell>Térreo</TableCell>
          <TableCell>40 pessoas</TableCell>
          <TableCell>Em manutenção</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
