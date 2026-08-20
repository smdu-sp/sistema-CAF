import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  Button,
} from "salas-reuniao-ui";

export function PreferenciaUnica() {
  const [notificar, setNotificar] = React.useState(true);
  return (
    <DropdownMenu open>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Notificações</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Preferências</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={notificar} onCheckedChange={setNotificar}>
          Notificações por e-mail
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={false}>
          Notificações por SMS
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ColunasVisiveis() {
  const [colunas, setColunas] = React.useState({
    patrimonio: true,
    setor: true,
    status: false,
  });
  return (
    <DropdownMenu open>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Colunas</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Exibir colunas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={colunas.patrimonio}
          onCheckedChange={(v) => setColunas((c) => ({ ...c, patrimonio: !!v }))}
        >
          Patrimônio
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={colunas.setor}
          onCheckedChange={(v) => setColunas((c) => ({ ...c, setor: !!v }))}
        >
          Setor
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={colunas.status}
          onCheckedChange={(v) => setColunas((c) => ({ ...c, status: !!v }))}
        >
          Status
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
