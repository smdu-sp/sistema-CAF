import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "salas-reuniao-ui";

export function LinhasInventario() {
  return (
    <Table style={{ width: 520 }}>
      <TableHeader>
        <TableRow>
          <TableHead>Patrimônio</TableHead>
          <TableHead>Equipamento</TableHead>
          <TableHead>Setor</TableHead>
          <TableHead>Situação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>PAT-00231</TableCell>
          <TableCell>Notebook Dell Latitude</TableCell>
          <TableCell>Financeiro</TableCell>
          <TableCell>Em uso</TableCell>
        </TableRow>
        <TableRow data-state="selected">
          <TableCell>PAT-00232</TableCell>
          <TableCell>Monitor LG 24"</TableCell>
          <TableCell>TI</TableCell>
          <TableCell>Selecionado</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>PAT-00233</TableCell>
          <TableCell>Impressora HP LaserJet</TableCell>
          <TableCell>Recursos Humanos</TableCell>
          <TableCell>Em manutenção</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
