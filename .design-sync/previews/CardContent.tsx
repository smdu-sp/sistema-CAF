import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "salas-reuniao-ui";

export function TextoSimples() {
  return (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Setor</CardTitle>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: 14, margin: 0 }}>Secretaria Municipal de Urbanismo e Licenciamento</p>
      </CardContent>
    </Card>
  );
}

export function ListaDeInformacoes() {
  return (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Departamento de TI</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
          <p style={{ margin: 0 }}>Responsável: Maria Aparecida</p>
          <p style={{ margin: 0, color: "#6b7280" }}>ti@prefeitura.sp.gov.br</p>
        </div>
      </CardContent>
    </Card>
  );
}
