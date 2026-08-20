import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  Button,
} from "salas-reuniao-ui";

export function DetalheDeEquipamento() {
  return (
    <Drawer defaultOpen>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Notebook Dell Latitude</DrawerTitle>
        </DrawerHeader>
        <p style={{ padding: "0 16px", fontSize: 14, color: "var(--muted-foreground)" }}>
          Patrimônio 004521 — Alocado com Bruno Vieira, Setor de TI.
        </p>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Fechar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
