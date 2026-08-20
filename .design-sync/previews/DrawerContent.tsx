import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  Button,
  Label,
  Input,
} from "salas-reuniao-ui";

export function PainelDeFiltroDeSalas() {
  return (
    <Drawer defaultOpen>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filtrar Salas</DrawerTitle>
          <DrawerDescription>Ajuste os filtros para encontrar a sala ideal.</DrawerDescription>
        </DrawerHeader>
        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Label htmlFor="cap-min">Capacidade mínima</Label>
            <Input id="cap-min" type="number" placeholder="Ex: 8" />
          </div>
        </div>
        <DrawerFooter>
          <Button>Aplicar filtros</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
