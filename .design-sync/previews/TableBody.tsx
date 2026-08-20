import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "salas-reuniao-ui";

export function CorpoChamados() {
  return (
    <Table style={{ width: 520 }}>
      <TableHeader>
        <TableRow>
          <TableHead>Chamado</TableHead>
          <TableHead>Solicitante</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>#1042</TableCell>
          <TableCell>Mariana Alves</TableCell>
          <TableCell>Patrimônio</TableCell>
          <TableCell>Aberto</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>#1043</TableCell>
          <TableCell>Carlos Souza</TableCell>
          <TableCell>Transferência</TableCell>
          <TableCell>Em andamento</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>#1044</TableCell>
          <TableCell>Fernanda Lima</TableCell>
          <TableCell>Equipamento</TableCell>
          <TableCell>Concluído</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
