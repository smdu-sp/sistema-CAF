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

export function FiltrarSalas() {
  return (
    <Drawer defaultOpen>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filtrar Salas</DrawerTitle>
          <DrawerDescription>Ajuste os filtros para encontrar a sala ideal.</DrawerDescription>
        </DrawerHeader>
        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Label htmlFor="capacidade-min">Capacidade mínima</Label>
            <Input id="capacidade-min" type="number" placeholder="Ex: 8" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Label htmlFor="andar-filtro">Andar</Label>
            <Input id="andar-filtro" placeholder="Ex: 8º andar" />
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

export function DetalheDaReserva() {
  return (
    <Drawer defaultOpen>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Sala Diretoria</DrawerTitle>
          <DrawerDescription>Reserva de 25/08/2026, 14:00 às 15:00</DrawerDescription>
        </DrawerHeader>
        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 4 }}>
          <p style={{ fontSize: 14 }}>Responsável: Bruno Vieira</p>
          <p style={{ fontSize: 14 }}>Participantes: 8</p>
        </div>
        <DrawerFooter>
          <Button variant="destructive">Cancelar reserva</Button>
          <DrawerClose asChild>
            <Button variant="outline">Fechar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
