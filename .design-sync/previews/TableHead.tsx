import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "salas-reuniao-ui";

export function ColunasTeletrabalho() {
  return (
    <Table style={{ width: 520 }}>
      <TableHeader>
        <TableRow>
          <TableHead>Colaborador</TableHead>
          <TableHead>Unidade</TableHead>
          <TableHead>Data adesão</TableHead>
          <TableHead>Situação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Juliana Ramos</TableCell>
          <TableCell>Matriz</TableCell>
          <TableCell>03/02/2026</TableCell>
          <TableCell>Vigente</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Rodrigo Nunes</TableCell>
          <TableCell>Filial Sul</TableCell>
          <TableCell>17/05/2026</TableCell>
          <TableCell>Encerrada</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
