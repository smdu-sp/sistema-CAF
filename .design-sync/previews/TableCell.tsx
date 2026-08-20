import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "salas-reuniao-ui";

export function CelulasRamais() {
  return (
    <Table style={{ width: 480 }}>
      <TableHeader>
        <TableRow>
          <TableHead>Ramal</TableHead>
          <TableHead>Setor</TableHead>
          <TableHead>Responsável</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>4521</TableCell>
          <TableCell>Atendimento</TableCell>
          <TableCell>Patrícia Gomes</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>4522</TableCell>
          <TableCell>Suporte TI</TableCell>
          <TableCell>Diego Martins</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>4523</TableCell>
          <TableCell>Recepção</TableCell>
          <TableCell>Aline Costa</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
